import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ChatDto, createLocalChat, ImageElem, Message, MessageNotifDto, SearchChatDto, UpdatedSeenDto } from "../models/chat";
import { store } from "./store";

let id = -10

export default class DirectStore {
    chats: ChatDto[] = [];
    searchResults: SearchChatDto[] = [];
    hubConnection: HubConnection | null = null;
    currentChat: ChatDto | null = null;
    images: ImageElem[] = []
    videos: string[] = []

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
                console.log(result)
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
        if(!this.currentChat || this.currentChat.id !== result.chatId) {
            return;
        }
        if(this.currentChat) {
            switch(this.currentChat.type) {
                case 0:
                    const privateChat = {...this.currentChat.privateChat!, otherLastSeen: new Date(result.lastSeen)}; 
                    this.currentChat = {...this.currentChat, privateChat};
                    break;
                case 1:
                    const groupChat = this.currentChat!.groupChat!;
                    groupChat!.members!.find(x => x.username === result.username)!.lastSeen = new Date(result.lastSeen); 
                    this.currentChat! = {...this.currentChat, groupChat};
                    break;
                case 2:
                    const channelChat = this.currentChat!.channelChat!;
                    channelChat!.members!.find(x => x.username === result.username)!.lastSeen = new Date(result.lastSeen); 
                    this.currentChat! = {...this.currentChat, channelChat};
                    break;
            }
        }
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
    }
    
    createLocalMessage = (body: string) => {
        if(!this.currentChat)
            return -1

        this.getCurrentMessages()!.push({
                body,
                createdAt: new Date(),
                displayName: store.userStore.user!.displayName,
                username: store.userStore.user!.username,
                local: true,
                id: id,
                type: 0,
                image: "",
                publicId: "",
                url: ""
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
            localBlob: file
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
            localBlob: file
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
        if(!this.currentChat || this.currentChat.id !== response.chatId) {
            return;
        }

        response.message.createdAt = new Date(response.message.createdAt);

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
    }

    updateLocalMessage = (response: Message, id: number) => {
        if(this.currentChat) {
            let msg = this.getCurrentMessages()?.find(x => x.id === id);
            if(!msg) {
                return
            }
            msg.local = false;
            msg.createdAt = new Date(response.createdAt);
            msg.image = response.image;
            msg.publicId = response.publicId;
            msg.url = response.url
            msg.id = response.id;
            msg.localBlob = undefined;
        }
    } 

    createMessage = async (body: string) => {
        if(!this.currentChat)
            return;
        const id = this.createLocalMessage(body);
        if(id === -1) 
            return
        const response = await agent.Chats.createMessage(body, this.currentChat.id);
        this.updateLocalMessage(response, id);
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
        const response = await agent.Chats.createPhoto(file ,body, this.currentChat.id, config);
        this.updateLocalMessage(response.data, id);
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
        const response = await agent.Chats.createVideo(file ,body, this.currentChat.id, config);
        this.updateLocalMessage(response.data, id);
    }

    createPrivateChat = async (userId: string, body: string) => {
        try {
            if(!this.currentChat)
                return;

            const response = await agent.Chats.createPrivateChat(userId, body);
            this.setChat({...this.currentChat, id: response.chatId});
            runInAction(() => {
                if(this.currentChat)
                    this.currentChat.privateChat!.messages = [response.message];
            });
        } catch(error) {
            console.log(error);
        }
    }

    createChannel = async (name: string, description: string) => {
        try {
            const response = await agent.Chats.createChannel(name, description);

            if(this.currentChat)
            this.setChat(response);
            runInAction(() => this.currentChat = response);
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
        try {
            await agent.Chats.updateSeen(this.currentChat.id, newLastSeen);
        } catch(error) {
            console.log(error);
        }
    }
}