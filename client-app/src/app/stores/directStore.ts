import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Theme } from '@mui/material/styles/createTheme';
import { makeAutoObservable, runInAction } from 'mobx';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FileRecord } from '../../features/direct/chat-view/ChatInput';
import agent from '../api/agent';
import {
    AdminPermissions,
    ChatDto,
    ChatPage,
    ConnectedDto,
    createLocalChat,
    createLocalSavedChat,
    DisconnectedDto,
    GroupMemberPermissions,
    ImageElem,
    Message,
    MessageNotifDto,
    SearchResult,
    TypingDto,
    UpdatedSeenDto
} from '../models/chat';
import { Pagination, PagingParams } from '../models/pagination';
import { Photo, Profile } from '../models/profile';
import { store } from './store';

let id = -10;

export default class DirectStore {
    chats: ChatDto[] = [];
    searchResults: SearchResult[] = [];
    searchResultsGlobal: SearchResult[] = [];
    searchResultsContacts: SearchResult[] = [];
    searchResultsContactsGlobal: SearchResult[] = [];
    hubConnection: HubConnection | null = null;
    currentChat: ChatDto | null = null;
    images: ImageElem[] = [];
    videos: string[] = [];
    updatingPermissionsAll = false;
    loadingChatDetails = false;
    replyMessage: Message | null = null;
    removingPin = false;
    selected: Message[] = [];
    forwarding = false;
    forwardingSingle = false;
    forwardedMessages: Message[] = [];
    srcChatId = '';
    menuMsg: Message | null = null;
    showSenderName = false;
    loadingChats = true;
    settingsOpen = false;
    nameOpen = false;
    bioOpen = false;
    copyOpen = false;
    copyFunc: (() => void) | undefined;
    loadingAdminPermissions = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    paginationMessages: Pagination | null = null;
    pagingParamsMessages = new PagingParams();
    contactsOpen = false;
    lightboxOpen = false;
    lightboxIndex = 0;
    deleteMsgId = -1;
    messagesRef: (HTMLElement | null)[] = [];
    profilePicsOpen: Profile | null = null;
    groupPicsOpen: ChatDto | null = null;
    updatingPermissions = false;
    loadingFollowing = false;
    initialMessagesLoaded = false;
    connected: 'connected' | 'reconnecting' = 'reconnecting';
    mode: 'light' | 'dark' = 'light';
    theme: Theme | null = null;
    newMsgQueue: MessageNotifDto[] = [];
    file: FileRecord | null = null;
    navigate: NavigateFunction | null = null;
    creatingChat = false;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = () => {
        if (store.userStore.user?.token) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_DIRECT_URL!, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection
                .start()
                .then(() => {
                    runInAction(() => {
                        this.connected = 'connected';
                    });
                })
                .catch((error) => console.log('Error establishing the connection'));

            this.hubConnection.onreconnected(() => {
                runInAction(() => {
                    this.connected = 'connected';
                });
                toast.success('Reconnected.');
            });

            this.hubConnection.onreconnecting(() => {
                runInAction(() => {
                    this.connected = 'reconnecting';
                });
                toast.error('Disconnected. Reconnecting...');
            });

            this.hubConnection.on('ReceiveNewMessage', (result: MessageNotifDto) => {
                this.addNewMessage(result);
            });

            this.hubConnection.on('ReceiveNewSeen', (result: UpdatedSeenDto) => {
                this.updateSeen(result);
            });

            this.hubConnection.on('Connected', (result: ConnectedDto) => {
                this.updateConnected(result);
            });

            this.hubConnection.on('Disconnected', (result: DisconnectedDto) => {
                this.updateDisconnected(result);
            });

            this.hubConnection.on('StartedTyping', (result: TypingDto) => {
                this.handleStartedTyping(result);
            });

            this.hubConnection.on('StoppedTyping', (result: TypingDto) => {
                this.handleStoppedTyping(result);
            });
        }
    };

    stopHubConnection = () => {
        this.hubConnection?.stop().catch((error) => console.log('Error stopping connection: ', error));
    };

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        return params;
    }

    get axiosParamsMessages() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParamsMessages.pageNumber.toString());
        params.append('pageSize', this.pagingParamsMessages.pageSize.toString());
        return params;
    }

    get canDelete() {
        return !!this.menuMsg && this.canDeleteMsg(this.menuMsg);
    }

    canDeleteMsg = (msg: Message) => {
        return (
            !!this.currentChat &&
            !!store.userStore.user &&
            (msg.username === store.userStore.user.username ||
                (this.currentChat.type === 1 && ((this.currentChat.membershipType === 1 && this.currentChat.groupChat!.deleteMessages) || this.currentChat.membershipType === 2)))
        );
    };

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    };

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    };

    setPaginationMessages = (pagination: Pagination) => {
        this.paginationMessages = pagination;
    };

    setPagingParamsMessages = (pagingParams: PagingParams) => {
        this.pagingParamsMessages = pagingParams;
    };

    loadChats = async () => {
        try {
            const result = await agent.Chats.list(this.axiosParams);
            runInAction(() => {
                const chats = result.data;
                this.setPagination(result.pagination);
                chats.forEach((x) => {
                    if (x.lastMessage) x.lastMessage.createdAt = new Date(x.lastMessage?.createdAt + 'Z');
                    x.lastSeen = new Date(x.lastSeen + 'Z');
                });
                this.chats = [...this.chats, ...chats];
                this.loadingChats = false;
            });
        } catch (error) {
            console.log(error);
        }
    };

    loadMessages = async (chatId: string) => {
        try {
            const params = this.axiosParamsMessages;
            params.append('chatId', chatId);
            const result = await agent.Chats.listMessages(params);
            runInAction(() => {
                if (!this.currentChat || chatId !== this.currentChat.id) {
                    return;
                }
                const messages = result.data;
                messages.forEach((x) => {
                    x.local = false;
                    x.createdAt = new Date(x.createdAt + 'Z');
                    x.createdAt.setMilliseconds(999);
                });
                this.setPaginationMessages(result.pagination);
                if (this.currentChat.messages) {
                    this.currentChat.messages = [...this.currentChat.messages, ...messages];
                } else {
                    this.currentChat.messages = messages;
                }
                this.updateMessages();
                this.handleDateMessages();
                this.initialMessagesLoaded = false;
            });
        } catch (error) {
            console.log(error);
        }
    };

    clearChats = () => {
        this.chats = [];
        this.stopHubConnection();
    };

    updateSeen = (result: UpdatedSeenDto) => {
        result.lastSeen = new Date(result.lastSeen);

        const chats = this.chats;
        const chat = chats.find((x) => x.id === result.chatId);
        if (
            chat &&
            chat.lastMessage &&
            chat.lastMessage.username === store.userStore.user?.username &&
            result.username !== store.userStore.user?.username &&
            result.lastSeen >= chat.lastMessage.createdAt
        ) {
            chat.lastMessageSeen = true;
            this.chats = chats;
        }

        if (!this.currentChat || this.currentChat.id !== result.chatId) {
            return;
        }
        const curChat = this.currentChat;
        switch (this.currentChat.type) {
            case 0:
                if (curChat.privateChat!.otherLastSeen! <= result.lastSeen) curChat.privateChat = { ...curChat.privateChat!, otherLastSeen: result.lastSeen };
                break;
            case 1:
                if (curChat.groupChat!.members!.find((x) => x.username === result.username)!.lastSeen <= result.lastSeen)
                    curChat.groupChat!.members!.find((x) => x.username === result.username)!.lastSeen = result.lastSeen;
                break;
        }

        this.currentChat = { ...curChat };
    };

    private setChat = (chat: ChatDto) => {
        this.chats.push(chat);
    };

    setLocalChat = (username: string, displayName: string, image?: string) => {
        this.currentChat = createLocalChat(username, displayName, image);
    };

    setLocalSavedChat = () => {
        const chat = this.chats.find((x) => x.type === 3);
        if (chat) {
            this.getChatDetails(chat);
        } else {
            this.currentChat = createLocalSavedChat();
        }
    };

    setCurrentChat = (chat: ChatDto) => {
        this.currentChat = chat;
    };

    getPrivateChatDetails = async (chat: ChatDto) => {
        const response = await agent.Chats.getPrivateChatDetails(chat.id);

        runInAction(() => {
            chat.privateChat = response;
            chat.privateChat.myLastSeen = new Date(chat.privateChat.myLastSeen + 'Z');
            chat.privateChat.otherLastSeen = new Date(chat.privateChat.otherLastSeen + 'Z');
            this.updateMessages();
            this.currentChat = chat;
        });
    };

    getGroupChatDetails = async (chat: ChatDto) => {
        const response = await agent.Chats.getGroupDetails(chat.id);

        runInAction(() => {
            chat.groupChat = response;
            chat.groupChat!.members.forEach((x) => {
                x.lastSeen = new Date(x.lastSeen + 'Z');
                x.lastSeenOnline = new Date(x.lastSeenOnline + 'Z');
            });
            chat.groupChat!.memberCount = chat.groupChat.members.length;
            chat.groupChat!.me = chat.groupChat.members.find((x) => x.username === store.userStore.user?.username);
            this.updateMessages();
            this.currentChat = chat;
        });
    };

    // getChannelChatDetails = async (chat: ChatDto) => {
    //     const response = await agent.Chats.getChannelDetails(chat.id);

    //     runInAction(() => {
    //         chat.channelChat = response;
    //         chat.messages = chat.channelChat.messages;
    //         chat.channelChat!.messages.forEach((x) => {
    //             x.local = false;
    //             x.createdAt = new Date(x.createdAt + 'Z');
    //             x.createdAt.setMilliseconds(999);
    //         });
    //         chat.channelChat!.members.forEach((x) => {
    //             x.lastSeen = new Date(x.lastSeen + 'Z');
    //         });
    //         chat.channelChat!.memberCount = chat.channelChat.members.length;
    //         chat.channelChat!.me = chat.channelChat.members.find((x) => x.username === store.userStore.user?.username);
    //         this.updateMessages();
    //     });
    // };

    getChatDetails = async (chat: ChatDto) => {
        store.chatStore.clearStack();
        this.replyMessage = null;
        this.loadingChatDetails = true;
        this.currentChat = chat;
        this.currentChat.messages = undefined;
        this.paginationMessages = null;
        this.initialMessagesLoaded = false;
        this.pagingParamsMessages = new PagingParams();
        this.file = null;

        if (chat.type < 2 && this.navigate) this.navigate(`direct/inbox/${chat.id}`, { replace: true });

        switch (chat.type) {
            case 0:
                await this.getPrivateChatDetails(chat);
                break;
            case 1:
                await this.getGroupChatDetails(chat);
                break;
            // case 2:
            // await this.getChannelChatDetails(chat);
            // break;
        }
        await this.loadMessages(chat.id);
        this.handleDateMessages();
        runInAction(() => {
            this.selected = [];
            this.forwarding = false;
            this.loadingChatDetails = false;
        });
    };

    createLocalMessage = (body: string) => {
        if (!this.currentChat) return -1;

        this.currentChat.messages?.push({
            body,
            createdAt: new Date(),
            displayName: store.userStore.user!.displayName,
            username: store.userStore.user!.username,
            local: true,
            id: id,
            type: 0,
            image: '',
            publicId: '',
            url: '',
            replyToId: this.replyMessage ? this.replyMessage.id : 0,
            forwardUsername: '',
            forwardDisplayName: ''
        });

        id--;
        return id + 1;
    };

    createLocalImage = (file: Blob, body: string) => {
        if (!this.currentChat) return { id: -1, msg: undefined };
        if (!this.currentChat.messages) {
            this.currentChat.messages = [];
        }

        const msg = {
            body,
            createdAt: new Date(),
            displayName: store.userStore.user!.displayName,
            username: store.userStore.user!.username,
            local: true,
            id: id,
            type: 1,
            image: '',
            publicId: '',
            url: '',
            localBlob: file,
            replyToId: this.replyMessage ? this.replyMessage.id : 0
        } as Message;

        this.currentChat.messages = [...this.currentChat.messages, msg];

        id--;
        return { id: id + 1, msg };
    };

    createLocalVideo = (file: Blob, body: string) => {
        if (!this.currentChat || !this.currentChat.messages) return { id: -1, msg: undefined };

        const msg = {
            body,
            createdAt: new Date(),
            displayName: store.userStore.user!.displayName,
            username: store.userStore.user!.username,
            local: true,
            id: id,
            type: 2,
            image: '',
            publicId: '',
            url: '',
            localBlob: file,
            replyToId: this.replyMessage ? this.replyMessage.id : 0
        } as Message;

        this.currentChat.messages = [...this.currentChat.messages, msg];

        id--;
        return { id: id + 1, msg };
    };

    createLocalVoice = (file: Blob) => {
        if (!this.currentChat || !this.currentChat.messages) return { id: -1, msg: undefined };

        const msg = {
            body: '',
            createdAt: new Date(),
            displayName: store.userStore.user!.displayName,
            username: store.userStore.user!.username,
            local: true,
            id: id,
            type: 3,
            image: '',
            publicId: '',
            url: '',
            localBlob: file,
            replyToId: this.replyMessage ? this.replyMessage.id : 0
        } as Message;

        this.currentChat.messages = [...this.currentChat.messages, msg];

        id--;
        return { id: id + 1, msg };
    };

    addNewMessage = (response: MessageNotifDto) => {
        const chats = this.chats;
        const chat = this.chats.find((x) => x.id === response.chatId);

        response.message.createdAt = new Date(response.message.createdAt);

        if (chat) {
            if (!chat.lastMessage) {
                chat.lastMessage = response.message;
                chat.notSeenCount = response.notSeenCount;
            } else {
                if (chat.lastMessage.createdAt < response.message.createdAt) {
                    chat.lastMessage = response.message;
                    chat.notSeenCount = response.notSeenCount;
                }
            }
        }

        this.chats = chats;
        this.newMsgQueue = [...this.newMsgQueue, response];

        if (!this.currentChat || !this.currentChat.messages || this.currentChat.id !== response.chatId) {
            return;
        }

        this.currentChat.messages = [...this.currentChat.messages, response.message];

        this.updateMessages();
        this.handleDateMessages();
    };

    updateLocalMessage = (response: Message, id: number) => {
        if (this.currentChat) {
            const curChat = this.currentChat;
            let msg = this.currentChat.messages?.find((x) => x.id === id);
            if (!msg) {
                return;
            }
            msg.local = false;
            msg.createdAt = new Date(response.createdAt);
            msg.createdAt.setMilliseconds(999);
            msg.image = response.image;
            msg.publicId = response.publicId;
            msg.url = response.url;
            msg.id = response.id;
            msg.localBlob = undefined;
            const chat = this.chats.find((x) => x.id === curChat.id)!;
            if (!chat.lastMessage || msg.createdAt > chat.lastMessage.createdAt) {
                chat.lastMessage = msg;
                chat.lastMessageSeen = false;
            }
            this.chats = [...this.chats];
            this.currentChat = curChat;
        }
    };

    createMessage = async (body: string) => {
        if (!this.currentChat) return;
        if (this.currentChat.type === -10 && !this.creatingChat) {
            await this.createPrivateChat(this.currentChat.privateChat!.otherUsername);
        } else if (this.currentChat.type === -20) {
            await this.createSavedMessagesChat();
        }
        const id = this.createLocalMessage(body);
        if (id === -1) return;
        const response = await agent.Chats.createMessage(body, this.currentChat.id, this.replyMessage ? this.replyMessage.id : -1);
        runInAction(() => {
            this.updateLocalMessage(response, id);
            this.replyMessage = null;
        });
        this.updateMessages();
        this.handleDateMessages();
    };

    createPhoto = async (file: Blob, body: string) => {
        if (!this.currentChat) return;
        if (this.currentChat.type === -10) {
            await this.createPrivateChat(this.currentChat.privateChat!.otherUsername);
        } else if (this.currentChat.type === -20) {
            await this.createSavedMessagesChat();
        }
        const { id } = this.createLocalImage(file, body);
        if (id === -1) return;
        // let config = {
        //   onDownloadProgress: (progressEvent: any) => {
        // let percentCompleted = Math.floor(
        //   (progressEvent.loaded * 100) / progressEvent.total
        // );
        // console.log(percentCompleted);
        //   },
        // };
        let config = {};
        const response = await agent.Chats.createPhoto(file, body, this.currentChat.id, config, this.replyMessage ? this.replyMessage.id : -1);
        runInAction(() => {
            this.updateLocalMessage(response.data, id);
            this.replyMessage = null;
        });
        this.updateMessages();
        this.handleDateMessages();
    };

    createVideo = async (file: Blob, body: string) => {
        if (!this.currentChat) return;
        if (this.currentChat.type === -10) {
            await this.createPrivateChat(this.currentChat.privateChat!.otherUsername);
        } else if (this.currentChat.type === -20) {
            await this.createSavedMessagesChat();
        }
        const { id } = this.createLocalVideo(file, body);
        if (id === -1) return;
        // let config = {
        //   onUploadProgress: (progressEvent: any) => {
        // let percentCompleted = Math.floor(
        //   (progressEvent.loaded * 100) / progressEvent.total
        // );
        // msg!.localProgress = percentCompleted;
        //   },
        // };
        let config = {};
        const response = await agent.Chats.createVideo(file, body, this.currentChat.id, config, this.replyMessage ? this.replyMessage.id : -1);
        this.updateLocalMessage(response.data, id);
        this.replyMessage = null;
        this.updateMessages();
        this.handleDateMessages();
    };

    createVoice = async (file: Blob) => {
        if (!this.currentChat) return;
        if (this.currentChat.type === -10) {
            await this.createPrivateChat(this.currentChat.privateChat!.otherUsername);
        } else if (this.currentChat.type === -20) {
            await this.createSavedMessagesChat();
        }
        const { id } = this.createLocalVoice(file);
        if (id === -1) return;
        // let config = {
        //   onUploadProgress: (progressEvent: any) => {
        // let percentCompleted = Math.floor(
        //   (progressEvent.loaded * 100) / progressEvent.total
        // );
        // msg!.localProgress = percentCompleted;
        //   },
        // };
        let config = {};
        const response = await agent.Chats.createVoice(file, this.currentChat.id, config, this.replyMessage ? this.replyMessage.id : -1);
        runInAction(() => {
            this.updateLocalMessage(response.data, id);
            this.replyMessage = null;
            this.handleDateMessages();
        });
    };

    createPrivateChat = async (username: string) => {
        this.creatingChat = true;
        try {
            if (!this.currentChat) return;

            const response = await agent.Chats.createPrivateChat(username);
            response.lastSeen = new Date(response.lastSeen + 'Z');
            this.setChat(response);
            await this.getChatDetails(response);
        } catch (error) {
            runInAction(() => {
                this.creatingChat = false;
            });
            console.log(error);
        }
        runInAction(() => {
            this.creatingChat = false;
        });
    };

    createSavedMessagesChat = async () => {
        try {
            const response = await agent.Chats.createSavedChat();
            runInAction(() => {
                this.setChat(response);
                response.messages = [];
                this.currentChat = response;
            });
        } catch (error) {
            console.log(error);
        }
    };

    createChannel = async (name: string, description: string) => {
        try {
            const response = await agent.Chats.createChannel(name, description);

            this.setChat(response);
            runInAction(() => {
                this.currentChat = response;
                store.groupStore.setCreatedChannel(response);
                this.getChatDetails(this.currentChat);
            });
        } catch (error) {
            console.log(error);
        }
    };

    createGroup = async (name: string, members: string[]) => {
        try {
            const response = await agent.Chats.createGroup(name, members);

            this.setChat(response);
            runInAction(() => this.getChatDetails(response));
        } catch (error) {
            console.log(error);
        }
    };

    updateMessages = () => {
        if (!this.currentChat) return;

        this.currentChat.messages?.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        this.images = [];
        this.videos = [];
        this.currentChat.messages?.forEach((x) => {
            switch (x.type) {
                case 1:
                    this.images.push({ src: x.url, description: x.body ? x.body : 'No comment', id: x.id });
                    break;
                case 2:
                    this.videos.push(x.url);
            }
        });

        if (this.currentChat.messages && this.initialMessagesLoaded) {
            const thisChat = this.chats.find((x) => x.id === this.currentChat?.id);
            if (thisChat) {
                if (this.currentChat.messages.length === 0) {
                    thisChat.lastMessage = null;
                } else {
                    const currentLastMessage = this.currentChat.messages[this.currentChat.messages.length - 1];
                    thisChat.lastMessage = currentLastMessage;
                }
            }
        }
    };

    // getCurrentMessages = () => {
    //     if (!this.currentChat) return;

    //     switch (this.currentChat.type) {
    //         case 0:
    //             return this.currentChat.privateChat!.messages;
    //         case 1:
    //             return this.currentChat.groupChat!.messages;
    //         case 2:
    //             return this.currentChat.channelChat!.messages;
    //     }
    // };

    getImageIndex = (id: number) => {
        return this.images.findIndex((x) => x.id === id);
    };

    updateLastSeen = async (newLastSeen: Date) => {
        if (!this.currentChat) return;

        const chats = this.chats;
        const chat = chats.find((x) => x.id === this.currentChat?.id);

        if (chat && chat.messages) {
            chat.notSeenCount = chat.messages.filter((x) => x.createdAt > newLastSeen).length;
            this.chats = chats;
        }

        switch (this.currentChat.type) {
            case 0:
                this.currentChat.privateChat!.myLastSeen = newLastSeen;
                break;
            case 1:
                this.currentChat.groupChat!.me!.lastSeen = newLastSeen;
                break;
            case 2:
                this.currentChat.channelChat!.me!.lastSeen = newLastSeen;
                break;
        }

        this.currentChat = { ...this.currentChat };

        try {
            await agent.Chats.updateSeen(this.currentChat.id, newLastSeen);
        } catch (error) {
            console.log(error);
        }
    };

    addMembers = async (chat: ChatDto, memberUsernames: string[]) => {
        try {
            const response = await agent.Chats.addMembers(chat.id, memberUsernames);
            runInAction(() => {
                if (this.currentChat && this.currentChat.id === chat.id) {
                    response.forEach((x) => {
                        x.lastSeen = new Date(x.lastSeen + 'Z');
                        x.lastSeenOnline = new Date(x.lastSeen + 'Z');
                    });
                    this.currentChat.groupChat!.members = [...this.currentChat.groupChat!.members, ...response];
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    removeMember = async (username: string) => {
        if (!this.currentChat) return;
        try {
            await agent.Chats.removeMember(this.currentChat.id, username);
            switch (this.currentChat.type) {
                case 1:
                    const groupChat = this.currentChat.groupChat!;
                    groupChat.members = groupChat.members.filter((x) => x.username !== username);
                    this.currentChat = { ...this.currentChat, groupChat };
                    break;
                case 2:
                    const channelChat = this.currentChat.channelChat!;
                    channelChat.members = channelChat.members.filter((x) => x.username !== username);
                    this.currentChat = { ...this.currentChat, channelChat };
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

    updatePermissions = async (chat: ChatDto, permissions: GroupMemberPermissions, chatPage: ChatPage) => {
        try {
            this.updatingPermissionsAll = true;
            await agent.Chats.updateMembersPermissions(chat.id, permissions);
            runInAction(() => {
                if (this.currentChat && this.currentChat.type === 1) {
                    const groupChat = this.currentChat.groupChat!;
                    this.currentChat.groupChat! = { ...groupChat, ...permissions };
                    this.currentChat = { ...this.currentChat, groupChat };
                    store.chatStore.removeFromStack(chatPage);
                    this.updatingPermissionsAll = false;
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateSinglePermissions = async (chat: ChatDto, permissions: GroupMemberPermissions, chatPage: ChatPage, targetUsername: string) => {
        try {
            this.updatingPermissions = true;
            const result = await agent.Chats.updateMemberPermissions(chat.id, permissions, targetUsername);
            runInAction(() => {
                if (this.currentChat && this.currentChat.id === chat.id) {
                    const groupChat = this.currentChat.groupChat!;
                    const member = groupChat.members.find((x) => x.username === targetUsername);
                    if (member) {
                        member.sendMessages = result.sendMessages;
                        member.sendMedia = result.sendMedia;
                        member.addUsers = result.addUsers;
                        member.pinMessages = result.pinMessages;
                        member.changeChatInfo = result.changeChatInfo;
                    }
                    this.updatingPermissions = false;
                    store.chatStore.removeFromStack(chatPage);
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.updatingPermissions = false;
            });
        }
    };

    setReplyMessage = (message: Message) => {
        this.replyMessage = message;
    };

    getMessageById = (id: number) => {
        return this.currentChat?.messages?.find((x) => x.id === id);
    };

    getMessageIndexById = (id: number) => {
        return this.currentChat?.messages?.findIndex((x) => x.id === id);
    };

    clearReply = () => {
        this.replyMessage = null;
    };

    handleDateMessages = () => {
        if (!this.currentChat) return;
        const withoutDates = this.currentChat.messages?.filter((x) => x.type !== 1000);
        const result: Message[] = [];
        let lastDate: Date | null = null;
        withoutDates?.forEach((x, i) => {
            const withoutTime = new Date(Date.UTC(x.createdAt.getFullYear(), x.createdAt.getMonth(), x.createdAt.getDate()));
            if (!lastDate || withoutTime > lastDate) {
                lastDate = withoutTime;
                result.push({
                    id,
                    type: 1000,
                    createdAt: withoutTime
                } as Message);
                result.push(x);
                id--;
            } else {
                result.push(x);
            }
        });
        this.currentChat.messages = result;
        this.currentChat = { ...this.currentChat };
    };

    addPin = async (chatId: string, messageId: number, isMutual: boolean) => {
        try {
            const response = await agent.Chats.addPin(chatId, messageId, isMutual);
            runInAction(() => {
                if (!this.currentChat) return;
                this.currentChat.pins = [...this.currentChat.pins, response];
                this.currentChat.pins = this.currentChat.pins.sort((a, b) => a.id - b.id);
                const chat = this.chats.find((x) => x.id === this.currentChat!.id)!;
                chat.pins = this.currentChat.pins;
            });
        } catch (error) {
            console.log(error);
        }
    };

    removePin = async (chatId: string, pinId: number) => {
        try {
            this.removingPin = true;
            await agent.Chats.removePin(chatId, pinId);
            runInAction(() => {
                if (!this.currentChat) return;
                this.currentChat.pins = this.currentChat?.pins.filter((x) => x.id !== pinId);
                this.currentChat = { ...this.currentChat };
                const chat = this.chats.find((x) => x.id === this.currentChat!.id)!;
                chat.pins = this.currentChat.pins;
                this.removingPin = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.removingPin = false;
            });
        }
    };

    removeCurrentChat = () => {
        this.currentChat = null;
    };

    setSelected = (selected: Message[]) => {
        this.selected = selected;
    };

    setForwarding = (value: boolean) => {
        this.forwarding = value;
    };

    forwardToSingle = (chat: ChatDto) => {
        if (!this.currentChat) return;
        this.forwardedMessages = this.selected.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        this.srcChatId = this.currentChat.id;
        this.getChatDetails(chat);
        this.replyMessage = null;
        this.forwardingSingle = true;
    };

    forward = async (chatIds: string[], body: string, showSender: boolean = false) => {
        if (!this.currentChat) return;
        const sorted = this.selected.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const messageIds = sorted.map((x) => x.id);
        const lastForwardedMsg = sorted[sorted.length - 1];

        try {
            await agent.Chats.forwardMessages(chatIds, messageIds, this.currentChat.id, body, showSender);
            runInAction(() => {
                const chats = this.chats;
                chats.forEach((x) => {
                    if (chatIds.find((y) => y === x.id) && x.lastMessage && x.lastMessage.createdAt.getTime() < new Date().getTime()) {
                        x.lastMessage = { ...lastForwardedMsg, createdAt: new Date() };
                        x.lastMessageSeen = false;
                    }
                });
                this.forwarding = false;
            });
        } catch (error) {
            console.log(error);
        }
    };

    forwardSingle = async (body: string) => {
        if (!this.currentChat) return;
        const sorted = this.forwardedMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const messageIds = sorted.map((x) => x.id);
        const lastForwardedMsg = sorted[sorted.length - 1];

        try {
            await agent.Chats.forwardMessages([this.currentChat.id], messageIds, this.srcChatId, body, this.showSenderName);
            const chats = this.chats;
            const currentChatId = this.currentChat.id;
            const x = chats.find((x) => x.id === currentChatId);
            if (x && x.lastMessage && x.lastMessage.createdAt.getTime() < new Date().getTime()) {
                x.lastMessage = { ...lastForwardedMsg, createdAt: new Date() };
                x.lastMessageSeen = false;
                this.chats = chats;
            }
            runInAction(() => {
                this.forwarding = false;
            });
            this.getChatDetails(this.currentChat);
        } catch (error) {
            console.log(error);
        }
    };

    setMenuMsg = (value: Message) => {
        this.menuMsg = value;
    };

    menuForward = (id: number) => {
        const msg = this.getMessageById(id);
        if (msg) {
            this.selected = [msg];
            this.forwarding = true;
        }
    };

    setShowSenderName = (value: boolean) => {
        this.showSenderName = value;
    };

    clearForwardingSingle = () => {
        this.forwardingSingle = false;
        this.forwardedMessages = [];
    };

    clearSearchResults = () => {
        this.searchResults = [];
    };

    setSettingsOpen = (value: boolean) => {
        this.settingsOpen = value;
    };

    setNameOpen = (value: boolean) => {
        this.nameOpen = value;
    };

    setBioOpen = (value: boolean) => {
        this.bioOpen = value;
    };

    setCopyOpen = (value: boolean) => {
        this.copyOpen = value;
    };

    openCopy = (func: () => void) => {
        this.copyOpen = true;
        this.copyFunc = func;
    };

    updateAdminPermissions = async (chatId: string, targetUsername: string, permissions: AdminPermissions, chatPage: ChatPage) => {
        this.loadingAdminPermissions = true;
        try {
            await agent.Chats.updateAdminPermissions(chatId, targetUsername, permissions);
            runInAction(() => {
                const chat = this.chats.find((x) => x.id === chatId);
                if (chat && chat.groupChat) {
                    const target = chat.groupChat.members.find((x) => x.username === targetUsername);
                    if (target) {
                        target.deleteMessages = permissions.deleteMessages;
                        target.banUsers = permissions.banUsers;
                        target.addNewAdmins = permissions.addNewAdmins;
                        target.remainAnonymous = permissions.remainAnonymous;
                        target.customTitle = permissions.customTitle;
                        target.memberType = 1;
                    }
                }
                if (this.currentChat && this.currentChat.id === chatId) {
                    const target = this.currentChat.groupChat!.members.find((x) => x.username === targetUsername);
                    if (target) {
                        target.deleteMessages = permissions.deleteMessages;
                        target.banUsers = permissions.banUsers;
                        target.addNewAdmins = permissions.addNewAdmins;
                        target.remainAnonymous = permissions.remainAnonymous;
                        target.customTitle = permissions.customTitle;
                        target.memberType = 1;
                    }
                }
                this.loadingAdminPermissions = false;
                store.chatStore.removeFromStack(chatPage);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingAdminPermissions = false;
            });
        }
    };

    dismissAdmin = async (chatId: string, targetUsername: string, chatPage: ChatPage) => {
        this.loadingAdminPermissions = true;
        try {
            await agent.Chats.dismissAdmin(chatId, targetUsername);
            runInAction(() => {
                const chat = this.chats.find((x) => x.id === chatId);
                if (chat && chat.groupChat) {
                    const target = chat.groupChat.members.find((x) => x.username === targetUsername);
                    if (target) {
                        target.memberType = 0;
                    }
                }
                this.loadingAdminPermissions = false;
                store.chatStore.removeFromStack(chatPage);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingAdminPermissions = false;
            });
        }
    };

    deleteMessage = async (chatId: string, messageId: number) => {
        try {
            if (this.currentChat && this.currentChat.messages && this.currentChat.id === chatId) {
                const target = this.currentChat.messages.find((x) => x.id === messageId);
                if (target) {
                    target.beingDeleted = true;
                }
            }
            await agent.Chats.deleteMessage(chatId, messageId);
            runInAction(() => {
                if (this.currentChat && this.currentChat.messages && this.currentChat.id === chatId) {
                    this.currentChat.messages = this.currentChat.messages.filter((x) => x.id !== messageId);
                }
            });
            this.updateMessages();
            this.handleDateMessages();
        } catch (error) {
            console.log(error);
        }
    };

    setContactsOpen = (value: boolean) => {
        this.contactsOpen = value;
    };

    localChatSearch = async (substr: string) => {
        if (!substr) {
            this.searchResults = [];
            return;
        }
        if (!store.contactsStore.followings) {
            return;
        }
        const result: SearchResult[] = [];

        store.contactsStore.followings.forEach((x) => {
            const dispIndex = x.displayName.toLowerCase().indexOf(substr);
            if (dispIndex !== -1) {
                result.push({
                    displayName: x.displayName,
                    image: x.image,
                    startIndexDisp: dispIndex,
                    startIndexUser: -1,
                    username: x.username
                });
            } else {
                const userIndex = x.username.toLocaleLowerCase().indexOf(substr);

                if (userIndex !== -1) {
                    result.push({
                        displayName: x.displayName,
                        image: x.image,
                        startIndexUser: userIndex,
                        startIndexDisp: -1,
                        username: x.username
                    });
                }
            }
        });

        this.chats.forEach((x) => {
            if (x.type === 1) {
                const dispIndex = x.displayName.toLowerCase().indexOf(substr);
                if (dispIndex !== -1) {
                    result.push({
                        displayName: x.displayName,
                        image: x.image,
                        startIndexDisp: dispIndex,
                        startIndexUser: -1,
                        username: ''
                    });
                }
            }
        });

        this.searchResults = result;

        try {
            const response = await agent.Search.search(substr);
            runInAction(() => {
                this.searchResultsGlobal = response.filter((x) => this.searchResults.findIndex((y) => y.username === x.username) === -1);
            });
        } catch (error) {
            console.log(error);
        }
    };

    contactsSearch = async (substr: string) => {
        if (!substr) {
            this.searchResults = [];
            this.searchResultsGlobal = [];
            return;
        }
        if (!store.contactsStore.followings) {
            return;
        }
        const result: SearchResult[] = [];

        store.contactsStore.followings.forEach((x) => {
            const dispIndex = x.displayName.toLowerCase().indexOf(substr);
            if (dispIndex !== -1) {
                result.push({
                    displayName: x.displayName,
                    image: x.image,
                    startIndexDisp: dispIndex,
                    startIndexUser: -1,
                    username: x.username
                });
            } else {
                const userIndex = x.username.toLowerCase().indexOf(substr);

                if (userIndex !== -1) {
                    result.push({
                        displayName: x.displayName,
                        image: x.image,
                        startIndexUser: userIndex,
                        startIndexDisp: -1,
                        username: x.username
                    });
                }
            }
        });

        this.searchResultsContacts = result;

        try {
            const response = await agent.Search.search(substr);
            runInAction(() => {
                this.searchResultsContactsGlobal = response.filter((x) => this.searchResultsContacts.findIndex((y) => y.username === x.username) === -1);
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateConnected = (dto: ConnectedDto) => {
        //Update the contacts
        if (!store.contactsStore.followings) return;
        const contact = store.contactsStore.followings.find((x) => x.username === dto.username);
        if (contact) {
            store.contactsStore.followings.find((x) => x.username === dto.username)!.isOnline = true;
        }
        //Update the chat if private chat
        if (!this.chats) return;

        const chat = this.chats.find((x) => x.participantUsername === dto.username);
        if (chat) {
            this.chats.find((x) => x.participantUsername === dto.username)!.isOnline = true;
        }
        //Update the current chat if group
        if (!this.currentChat) return;
        if (this.currentChat.participantUsername === dto.username) {
            this.currentChat.isOnline = true;
        }
        if (this.currentChat.type === 1) {
            const member = this.currentChat.groupChat!.members.find((x) => x.username === dto.username);
            if (member) {
                this.currentChat.groupChat!.members.find((x) => x.username === dto.username)!.isOnline = true;
            }
        }
    };

    updateDisconnected = (dto: DisconnectedDto) => {
        const lastSeen = new Date(dto.lastSeen);

        //Update the contacts
        if (!store.contactsStore.followings) return;
        const contact = store.contactsStore.followings.find((x) => x.username === dto.username);
        if (contact) {
            store.contactsStore.followings.find((x) => x.username === dto.username)!.isOnline = false;
            store.contactsStore.followings.find((x) => x.username === dto.username)!.lastSeen = lastSeen;
        }
        //Update the chat if private chat
        if (!this.chats) return;

        const chat = this.chats.find((x) => x.participantUsername === dto.username);
        if (chat) {
            // this.chats = [...this.chats.filter((x) => x.participantUsername !== dto.username), chat];
            this.chats.find((x) => x.participantUsername === dto.username)!.isOnline = false;
            this.chats.find((x) => x.participantUsername === dto.username)!.lastSeen = lastSeen;
        }
        //Update the current chat if group or private chat
        if (!this.currentChat) return;
        if (this.currentChat.participantUsername === dto.username) {
            this.currentChat.isOnline = false;
            this.currentChat.lastSeen = lastSeen;
        }
        if (this.currentChat.type === 1) {
            const member = this.currentChat.groupChat!.members.find((x) => x.username === dto.username);
            if (member) {
                this.currentChat.groupChat!.members.find((x) => x.username === dto.username)!.isOnline = true;
                this.currentChat.groupChat!.members.find((x) => x.username === dto.username)!.lastSeenOnline = lastSeen;
            }
        }
    };

    handleStartedTyping = (dto: TypingDto) => {
        const chat = this.chats.find((x) => x.id === dto.chatId);

        if (chat) {
            if (chat.type === 0) {
                chat.typing = true;
                if (this.currentChat && this.currentChat.id === chat.id) {
                    this.currentChat.typing = true;
                }
            } else if (chat.type === 1) {
                if (chat.typists) {
                    chat.typists = [...chat.typists, { displayName: dto.displayName, username: dto.username }];
                    if (this.currentChat && this.currentChat.id === chat.id) {
                        this.currentChat.typists = [...chat.typists, { displayName: dto.displayName, username: dto.username }];
                    }
                } else {
                    chat.typists = [{ displayName: dto.displayName, username: dto.username }];
                    if (this.currentChat && this.currentChat.id === chat.id) {
                        this.currentChat.typists = [{ displayName: dto.displayName, username: dto.username }];
                    }
                }
            }
        }
    };

    handleStoppedTyping = (dto: TypingDto) => {
        const chat = this.chats.find((x) => x.id === dto.chatId);

        if (chat) {
            if (chat.type === 0) {
                chat.typing = undefined;
                if (this.currentChat && this.currentChat.id === chat.id) {
                    this.currentChat.typing = undefined;
                }
            } else if (chat.type === 1) {
                if (chat.typists && chat.typists.length > 1) {
                    chat.typists = chat.typists.filter((x) => x.username !== dto.username);
                    if (this.currentChat && this.currentChat.id === chat.id) {
                        this.currentChat.typists = chat.typists.filter((x) => x.username !== dto.username);
                    }
                } else {
                    chat.typists = undefined;
                    if (this.currentChat && this.currentChat.id === chat.id) {
                        this.currentChat.typists = undefined;
                    }
                }
            }
        }
    };

    startTyping = async (chat: ChatDto) => {
        if (chat.type < 0) {
            return;
        }
        try {
            await agent.Chats.startTyping(chat.id);
        } catch (error) {
            console.log(error);
        }
    };

    stopTyping = async (chat: ChatDto) => {
        if (chat.type < 0) {
            return;
        }
        try {
            await agent.Chats.stopTyping(chat.id);
        } catch (error) {
            console.log(error);
        }
    };

    openLightbox = (id: number) => {
        this.lightboxOpen = true;
        this.lightboxIndex = this.getImageIndex(id);
    };

    setLightboxIndex = (val: number) => {
        this.lightboxIndex = val;
    };

    resetLightbox = () => {
        this.lightboxOpen = false;
    };

    setDeleteMsgId = (val: number) => {
        this.deleteMsgId = val;
    };

    updateGroupPhoto = (photo: Photo) => {
        if (this.currentChat && this.currentChat.type === 1) {
            const photos = this.currentChat.groupChat!.photos;
            const main = photos.find((x) => x.isMain);
            if (main) {
                main.isMain = false;
            }
            photos.push(...photos, photo);
            this.currentChat.groupChat!.photos = photos;
            this.currentChat.image = photo.url;
            const chat = this.chats.find((x) => x.id === this.currentChat?.id);
            if (chat) {
                chat.image = photo.url;
            }
        }
    };

    setProfilePicsOpen = (value: Profile | null) => {
        this.profilePicsOpen = value;
    };

    setGroupPicsOpen = (value: ChatDto | null) => {
        this.groupPicsOpen = value;
    };

    deleteGroupPhoto = (id: string, chatId: string) => {
        if (!this.currentChat || !this.currentChat.groupChat || this.currentChat.id !== chatId) return;
        this.currentChat.groupChat.photos = this.currentChat.groupChat.photos.filter((x) => x.id !== id);
    };

    setGroupMainPhoto = (id: string, chatId: string, url: string) => {
        this.currentChat?.groupChat?.photos.forEach((x) => {
            if (x.id === id) {
                x.isMain = true;
            } else {
                x.isMain = false;
            }
        });

        const chat = this.chats.find((x) => x.id === chatId);
        if (chat) {
            chat.image = url;
        }
        if (this.currentChat?.id === chatId) {
            this.currentChat.image = url;
            this.groupPicsOpen = this.currentChat;
        }
    };

    updateFollowing = async (profile: Profile) => {
        if (!store.contactsStore.followings) return;
        this.loadingFollowing = true;
        try {
            const username = profile.username;
            await agent.Profiles.updateFollowing(username);
            if (store.contactsStore.followings.find((x) => x.username === username)) {
                store.contactsStore.removeFollowing(username);
            } else {
                store.contactsStore.addFollowing(profile);
            }
            runInAction(() => {
                this.loadingFollowing = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loadingFollowing = false;
            });
        }
    };

    switchMode = () => {
        if (this.mode === 'light') {
            this.mode = 'dark';
        } else {
            this.mode = 'light';
        }
    };

    setMode = (newVal: 'light' | 'dark') => {
        this.mode = newVal;
    };

    setTheme = (theme: Theme) => {
        this.theme = theme;
    };

    clearNewMsgQueue = () => {
        this.newMsgQueue = [];
    };

    setFile = (file: FileRecord | null) => {
        this.file = file;
    };

    openChatWithId = (id: string) => {
        const foundChat = this.chats.find((x) => x.id === id);
        if (!foundChat) return;
        if (this.currentChat && this.currentChat.id === foundChat.id) {
            toast.warn('The new message is in the current chat!');
        } else {
            this.getChatDetails(foundChat);
        }
    };

    updateGroupDetails = async (chatId: string, displayName: string, description: string) => {
        try {
            await agent.Chats.updateGroupDetails(chatId, displayName, description);

            const foundChat = this.chats.find((x) => x.id === chatId);
            runInAction(() => {
                if (foundChat) {
                    foundChat.displayName = displayName;
                    foundChat.groupChat!.description = description;
                }

                if (this.currentChat && this.currentChat.id === chatId) {
                    this.currentChat.displayName = displayName;
                    this.currentChat.groupChat!.description = description;
                }
            });
            toast.success('Updated group details.');
            return true;
        } catch (e) {
            toast.error('Failed to update group details.');
            console.log(e);
            return true;
        }
    };

    setNavigate = (navigate: NavigateFunction) => {
        this.navigate = navigate;
    };

    getChat = async (chatId: string) => {
        if (this.currentChat && this.currentChat.id === chatId) return;
        const chat = await agent.Chats.get(chatId);
        runInAction(() => {
            if (chat.lastMessage) chat.lastMessage.createdAt = new Date(chat.lastMessage?.createdAt + 'Z');
            chat.lastSeen = new Date(chat.lastSeen + 'Z');
        });
        this.getChatDetails(chat);
    };
}
