import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { FileRecord } from "../../features/direct/chat-view/ChatInput";
import agent from "../api/agent";
import { ChatDto, ChatPage, createLocalChat, GroupMemberPermissions, ImageElem, Message, MessageNotifDto, SearchChatDto, UpdatedSeenDto } from "../models/chat";
import { Profile } from "../models/profile";
import { store } from "./store";

let id = -10

export default class DirectStore {
    chats: ChatDto[] = [];
    searchResults: SearchChatDto[] = [];
    hubConnection: HubConnection | null = null;
    currentChat: ChatDto | null = null;
    images: ImageElem[] = []
    videos: string[] = []
    updatingPermissionsAll = false;
    loadingChatDetails = false;
    replyMessage: Message | null = null;
    removingPin = false;
    selected: Message[] = [];
    forwarding = false;
    forwardingSingle = false;
    forwardedMessages: Message[] = [];

    constructor() {
        makeAutoObservable(this);        
    }

    createHubConnection = () => {
        if(store.userStore.user?.token) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/direct', {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(error => console.log('Error establishing the connection'));

            this.hubConnection.on('LoadChats', (chats: ChatDto[]) => {
                runInAction(() => {
                    chats.forEach(x => {
                        if(x.lastMessage)
                            x.lastMessage.createdAt = new Date(x.lastMessage?.createdAt)
                    })
                    this.chats = chats;
                })
            });

            this.hubConnection.on('ReceiveSearchResults', (results: SearchChatDto[]) => {
                runInAction(() => {
                    this.searchResults = results;
                });
            });

            this.hubConnection.on('ReceiveNewMessage', (result: MessageNotifDto) => {
                this.addNewMessage(result);
            });

            this.hubConnection.on('ReceiveNewSeen', (result: UpdatedSeenDto) => {
                this.updateSeen(result);
            });
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearChats = () => {
        this.chats = [];       
        this.stopHubConnection();
    }

    updateSeen = (result: UpdatedSeenDto) => {
        result.lastSeen = new Date(result.lastSeen);

        const chats = this.chats;
        const chat = chats.find(x => x.id === result.chatId);
        if(chat 
            && chat.lastMessage 
            && chat.lastMessage.username === store.userStore.user?.username 
            && result.username !== store.userStore.user?.username
            && result.lastSeen >= chat.lastMessage.createdAt) {
            chat.lastMessageSeen = true;
            this.chats = chats;
        }

        if(!this.currentChat || this.currentChat.id !== result.chatId) {
            return;
        }
        const curChat = this.currentChat;
        switch(this.currentChat.type) {
            case 0:
                if(curChat.privateChat!.otherLastSeen! <= result.lastSeen)
                    curChat.privateChat = {...curChat.privateChat!, otherLastSeen: result.lastSeen}; 
                break;
            case 1:
                if(curChat.groupChat!.members!.find(x => x.username === result.username)!.lastSeen <= result.lastSeen)
                    curChat.groupChat!.members!.find(x => x.username === result.username)!.lastSeen = result.lastSeen; 
                break;
            case 2:
                if(curChat.channelChat!.members!.find(x => x.username === result.username)!.lastSeen <= result.lastSeen)
                    curChat.channelChat!.members!.find(x => x.username === result.username)!.lastSeen = result.lastSeen; 
                break;
        }

        this.currentChat = {...curChat};
    }

    searchChats = async (term: string) => {

        try {
            await this.hubConnection?.invoke('SearchChats', {term});
        } catch(error) {
            console.log(error);
        }
    }

    private setChat = (chat: ChatDto) => {
        this.chats.push(chat);
    }

    setLocalChat = (username: string, displayName: string, image: string) => {
        this.currentChat = createLocalChat(username, displayName, image);
    }

    setCurrentChat = (chat: ChatDto) => {
        this.currentChat = chat;
    }

    getPrivateChatDetails = async (chat: ChatDto) => {
        const response = await agent.Chats.getPrivateChatDetails(chat.id);

        runInAction(() => {
            chat.privateChat = response;
            chat.privateChat.messages.forEach(x => {
                x.local = false
                x.createdAt = new Date(x.createdAt + 'Z');
                x.createdAt.setMilliseconds(999);
            });
            chat.privateChat.myLastSeen = new Date(chat.privateChat.myLastSeen + 'Z');
            chat.privateChat.otherLastSeen = new Date(chat.privateChat.otherLastSeen + 'Z');
            this.currentChat = chat;
            this.updateMessages();
        })
    }

    getGroupChatDetails = async (chat: ChatDto) => {
        const response = await agent.Chats.getGroupDetails(chat.id);

        runInAction(() => {
            chat.groupChat = response;
            chat.groupChat!.messages.forEach(x => {
                x.local = false
                x.createdAt = new Date(x.createdAt + 'Z');
                x.createdAt.setMilliseconds(999);
            });
            chat.groupChat!.members.forEach(x => {
                x.lastSeen = new Date(x.lastSeen + 'Z');
            });
            chat.groupChat!.memberCount = chat.groupChat.members.length; 
            chat.groupChat!.me = chat.groupChat.members.find(x => x.username === store.userStore.user?.username);
            this.currentChat = chat;
            this.updateMessages();
        })
    }

    getChannelChatDetails = async (chat: ChatDto) => {
        const response = await agent.Chats.getChannelDetails(chat.id);
        
        runInAction(() => {
            chat.channelChat = response;
            chat.channelChat!.messages.forEach(x => {
                x.local = false
                x.createdAt = new Date(x.createdAt + 'Z');
                x.createdAt.setMilliseconds(999);
            });
            chat.channelChat!.members.forEach(x => {
                x.lastSeen = new Date(x.lastSeen + 'Z');
            });
            chat.channelChat!.memberCount = chat.channelChat.members.length; 
            chat.channelChat!.me = chat.channelChat.members.find(x => x.username === store.userStore.user?.username);
            this.currentChat = chat;
            this.updateMessages();
        })
    }

    getChatDetails = async (chat: ChatDto) => {
        store.chatStore.clearStack();
        this.replyMessage = null;
        this.loadingChatDetails = true;
        switch(chat.type) {
            case 0:
                await this.getPrivateChatDetails(chat);
                break;
            case 1:
                await this.getGroupChatDetails(chat);
                break;
            case 2:
                await this.getChannelChatDetails(chat);
                break;
        }
        this.handleDateMessages();
        this.selected = [];
        this.forwarding = false;
        this.loadingChatDetails = false;
    }
    
    createLocalMessage = (body: string) => {
        if(!this.currentChat)
            return -1

        this.getCurrentMessages()?.push({
                body,
                createdAt: new Date(),
                displayName: store.userStore.user!.displayName,
                username: store.userStore.user!.username,
                local: true,
                id: id,
                type: 0,
                image: "",
                publicId: "",
                url: "",
                replyToId: this.replyMessage ? this.replyMessage.id : 0
            });
        
        id--;
        return id + 1;
    }

    createLocalImage = (file: Blob, body: string) => {
        if(!this.currentChat)
            return {id:-1, msg:undefined}

        const msg = {
            body,
            createdAt: new Date(),
            displayName: store.userStore.user!.displayName,
            username: store.userStore.user!.username,
            local: true,
            id: id,
            type: 1,
            image: "",
            publicId: "",
            url: "",
            localBlob: file,
            replyToId: this.replyMessage ? this.replyMessage.id : 0
        } as Message;

        switch(this.currentChat.type) {
            case 0:
                this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, msg];
                break;
            case 1:
                this.currentChat.groupChat!.messages = [...this.currentChat.groupChat!.messages, msg];
                break;
            case 2:
                this.currentChat.channelChat!.messages = [...this.currentChat.channelChat!.messages, msg];
                break;
        }
        
        id--;
        return {id: id+1, msg};
    }

    createLocalVideo = (file: Blob, body: string) => {
        if(!this.currentChat)
            return {id:-1, msg:undefined};

        const msg = {
            body,
            createdAt: new Date(),
            displayName: store.userStore.user!.displayName,
            username: store.userStore.user!.username,
            local: true,
            id: id,
            type: 2,
            image: "",
            publicId: "",
            url: "",
            localBlob: file,
            replyToId: this.replyMessage ? this.replyMessage.id : 0
        } as Message;

        switch(this.currentChat.type) {
            case 0:
                this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, msg];
                break;
            case 1:
                this.currentChat.groupChat!.messages = [...this.currentChat.groupChat!.messages, msg];
                break;
            case 2:
                this.currentChat.channelChat!.messages = [...this.currentChat.channelChat!.messages, msg];
                break;
        }
                
        id--;
        return {id:id + 1, msg};
    }

    addNewMessage = (response: MessageNotifDto) => {
        const chats = this.chats;
        const chat = this.chats.find(x => x.id === response.chatId);

        response.message.createdAt = new Date(response.message.createdAt);

        if(chat) {
            if(!chat.lastMessage) {
                chat.lastMessage = response.message;
                chat.notSeenCount = response.notSeenCount;
            } else {
                if(chat.lastMessage.createdAt < response.message.createdAt) {
                    chat.lastMessage = response.message;
                    chat.notSeenCount = response.notSeenCount;
                }
            }
        }

        this.chats = chats;
        
        if(!this.currentChat || this.currentChat.id !== response.chatId) {
            return;
        }

        switch(this.currentChat.type) {
            case 0:
                const privateChat = this.currentChat.privateChat!;
                privateChat.messages = [...this.currentChat.privateChat!.messages, response.message];
                this.currentChat = {...this.currentChat, privateChat};
                break;
            case 1:
                const groupChat = this.currentChat.groupChat!;
                groupChat.messages =  [...groupChat.messages, response.message];
                this.currentChat = {...this.currentChat, groupChat};
                break;
            case 2:
                const channelChat = this.currentChat.channelChat!;
                channelChat.messages =  [...channelChat.messages, response.message];
                this.currentChat = {...this.currentChat, channelChat};
                break;
        }

        this.updateMessages();
        this.handleDateMessages();
    }

    updateLocalMessage = (response: Message, id: number) => {
        if(this.currentChat) {
            const curChat = this.currentChat;
            let msg = this.getCurrentMessages()?.find(x => x.id === id);
            if(!msg) {
                return
            }
            msg.local = false;
            msg.createdAt = new Date(response.createdAt);
            msg.createdAt.setMilliseconds(999);
            msg.image = response.image;
            msg.publicId = response.publicId;
            msg.url = response.url
            msg.id = response.id;
            msg.localBlob = undefined;
            const chat = this.chats.find(x => x.id === curChat.id)!;
            if(!chat.lastMessage || msg.createdAt > chat.lastMessage.createdAt) {
                chat.lastMessage = msg;
                chat.lastMessageSeen = false;
            }
            this.chats = [...this.chats];
            this.currentChat = curChat;
        }
    } 

    createMessage = async (body: string) => {
        if(!this.currentChat)
            return;
        const id = this.createLocalMessage(body);
        if(id === -1) 
            return;
        const response = await agent.Chats.createMessage(body, this.currentChat.id, this.replyMessage ? this.replyMessage.id : -1);
        this.updateLocalMessage(response, id);
        this.replyMessage = null;
        this.handleDateMessages();
    }

    createPhoto = async (file: Blob, body: string) => {
        if(!this.currentChat)
            return;
        const {id} = this.createLocalImage(file, body);
        if(id === -1)
            return
        // let config = {
        //   onDownloadProgress: (progressEvent: any) => {
            // let percentCompleted = Math.floor(
            //   (progressEvent.loaded * 100) / progressEvent.total
            // );
            // console.log(percentCompleted);
        //   },
        // };
        let config = {};
        const response = await agent.Chats.createPhoto(file ,body, this.currentChat.id, config, this.replyMessage ? this.replyMessage.id : -1);
        this.updateLocalMessage(response.data, id);
        this.replyMessage = null;
        this.handleDateMessages();
    }

    createVideo = async (file: Blob, body: string) => {
        if(!this.currentChat)
            return;
        const {id} = this.createLocalVideo(file, body);
        if(id === -1)
            return;
        // let config = {
        //   onUploadProgress: (progressEvent: any) => {
            // let percentCompleted = Math.floor(
            //   (progressEvent.loaded * 100) / progressEvent.total
            // );
            // msg!.localProgress = percentCompleted;
        //   },
        // };
        let config = {}
        const response = await agent.Chats.createVideo(file ,body, this.currentChat.id, config, this.replyMessage ? this.replyMessage.id : -1);
        this.updateLocalMessage(response.data, id);
        this.replyMessage = null;
        this.handleDateMessages();
    }

    createPrivateChat = async (username: string, body: string, file: FileRecord | null) => {
        try {
            console.log('yup')

            if(!this.currentChat)
                return;

            console.log('yupi')

            const response = await agent.Chats.createPrivateChat(username);
            this.setChat(response);
            this.getChatDetails(response).then(() => {
                if(!file) {
                    this.createMessage(body);
                } else {
                    if(file.video) {
                        this.createVideo(file.file, body);
                    } else {
                        this.createPhoto(file.file, body);
                    }
                }
            });
        } catch(error) {
            console.log(error);
        }
    }

    createChannel = async (name: string, description: string) => {
        try {
            const response = await agent.Chats.createChannel(name, description);

            this.setChat(response);
            runInAction(() => {
                this.currentChat = response;
                store.groupStore.setCreatedChannel(response);
                this.getChatDetails(this.currentChat);
            });
        } catch(error) {
            console.log(error);
        }
    }

    createGroup = async (name: string, members: string[]) => {
        try {
            const response = await agent.Chats.createGroup(name, members);

            this.setChat(response);
            runInAction(() => this.currentChat = response);
        } catch(error) {
            console.log(error);
        }
    }

    updateMessages = () => {
        if(!this.currentChat)
            return;

        this.getCurrentMessages()?.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());

        this.images = []
        this.videos = []
        this.getCurrentMessages()?.forEach(x => {
            switch(x.type) {
                case 1:
                    this.images.push({src: x.url, caption: x.body ? x.body : "No comment", id: x.id});
                    break;
                case 2:
                    this.videos.push(x.url);
            }
        })
    }

    getCurrentMessages = () => {
        if(!this.currentChat)
            return;

        switch(this.currentChat.type) {
            case 0:
                return this.currentChat.privateChat!.messages;
            case 1:
                return this.currentChat.groupChat!.messages;
            case 2:
                return this.currentChat.channelChat!.messages;
        }
    }

    getImageIndex = (id: number) => {
        return this.images.findIndex(x => x.id === id);
    }

    updateLastSeen = async (newLastSeen: Date) => {
        if(!this.currentChat)
            return;

        const chats = this.chats;
        const chat = chats.find(x => x.id === this.currentChat?.id);

        if(chat) {
            switch(chat.type) {
                case 0:
                    chat.notSeenCount = chat.privateChat!.messages.filter(x => x.createdAt > newLastSeen).length;
                    break;
                case 1:
                    chat.notSeenCount = chat.groupChat!.messages.filter(x => x.createdAt > newLastSeen).length;
                    break;
                case 2:
                    chat.notSeenCount = chat.channelChat!.messages.filter(x => x.createdAt > newLastSeen).length;
                    break;
            }
            this.chats = chats;
        }

        switch(this.currentChat.type) {
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

        this.currentChat = {...this.currentChat};

        try {
            await agent.Chats.updateSeen(this.currentChat.id, newLastSeen);
        } catch(error) {
            console.log(error);
        }
    }

    addMembers = async (chat: ChatDto, members: Profile[]) => {
        try {
            await agent.Chats.addMembers(chat.id, members.map(x => x.username));
        } catch(error) {
            console.log(error);
        }
    }

    removeMember = async (username: string) => {
        if(!this.currentChat)
            return;
        try {
            await agent.Chats.removeMember(this.currentChat.id, username);
            switch(this.currentChat.type) {
                case 1:
                    const groupChat = this.currentChat.groupChat!;
                    groupChat.members = groupChat.members.filter(x => x.username !== username);
                    this.currentChat = {...this.currentChat, groupChat};
                    break;
                case 2:
                    const channelChat = this.currentChat.channelChat!;
                    channelChat.members = channelChat.members.filter(x => x.username !== username);
                    this.currentChat = {...this.currentChat, channelChat};
                    break;
            }
        } catch(error) {
            console.log(error);
        }
    }

    updatePermissions = async (chat: ChatDto, permissions: GroupMemberPermissions, chatPage: ChatPage) => {
        try {
            this.updatingPermissionsAll = true;
            await agent.Chats.updateMemberPermissions(chat.id,permissions);
            runInAction(() => {
                if(this.currentChat && this.currentChat.type === 1) {
                    const groupChat = this.currentChat.groupChat!;
                    groupChat.memberPermissions = permissions;
                    this.currentChat = {...this.currentChat, groupChat};
                    store.chatStore.removeFromStack(chatPage);
                    this.updatingPermissionsAll = false;
                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    setReplyMessage = (message: Message) => {
        this.replyMessage = message;
    }

    getMessageById = (id: number) => {
        return this.getCurrentMessages()?.find(x => x.id === id);
    }

    getMessageIndexById = (id: number) => {
        return this.getCurrentMessages()?.findIndex(x => x.id === id);
    }

    clearReply = () => {
        this.replyMessage = null;
    }

    handleDateMessages = () => { 
        if(!this.currentChat)
            return;
        const withoutDates = this.getCurrentMessages()?.filter(x => x.type !== 1000);
        const result: Message[] = [];
        let lastDate: Date | null = null;
        withoutDates?.forEach((x,i) => {
            const withoutTime = new Date(Date.UTC(x.createdAt.getFullYear(),x.createdAt.getMonth(), x.createdAt.getDate()));
            if(!lastDate || withoutTime > lastDate) {
                lastDate = withoutTime;
                result.push({
                    id,
                    type: 1000,
                    createdAt: withoutTime} as Message);
                result.push(x);
                id--;
            } else {
                result.push(x);
            }
        })
        switch(this.currentChat?.type) {
            case 0:
                this.currentChat.privateChat!.messages = result; 
                break;
            case 1:
                this.currentChat.groupChat!.messages = result; 
                break;
            case 2:
                this.currentChat.channelChat!.messages = result; 
                break;
        }
        this.currentChat = {...this.currentChat};
    }

    addPin = async (chatId: string, messageId: number, isMutual: boolean) => {
        try {
            const response = await agent.Chats.addPin(chatId, messageId, isMutual);
            runInAction(() => {
                if(!this.currentChat)
                    return;
                this.currentChat.pins = [...this.currentChat.pins, response];
                this.currentChat.pins = this.currentChat.pins.sort((a,b) => a.id - b.id);
                const chat = this.chats.find(x => x.id === this.currentChat!.id)!;
                chat.pins = this.currentChat.pins;
            })  
        } catch(error) {
            console.log(error);
        }
    }

    removePin = async (chatId: string, pinId: number) => {
        try {
            this.removingPin = true;
            await agent.Chats.removePin(chatId, pinId);
            runInAction(() => {
                if(!this.currentChat)
                    return;
                this.currentChat.pins = this.currentChat?.pins.filter(x => x.id !== pinId);
                this.currentChat = {...this.currentChat};
                const chat = this.chats.find(x => x.id === this.currentChat!.id)!;
                chat.pins = this.currentChat.pins;
                this.removingPin = false;
            });
        } catch(error) {
            console.log(error);
            runInAction(() => {
                this.removingPin = false;
            });
        }
    }

    removeCurrentChat = () => {
        this.currentChat = null;
    }

    setSelected = (selected: Message[]) => {
        this.selected = selected;
    }

    setForwarding = (value: boolean) => {
        this.forwarding = value;
    }

    forwardToSingle = (chat: ChatDto) => {
        this.forwardedMessages = this.selected.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());
        this.getChatDetails(chat);
        this.replyMessage = null;
        this.forwardingSingle = true;
    }
}