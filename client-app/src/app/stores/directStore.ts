import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ChannelDetailsDto, ChatDto, createLocalChat, ImageElem, Message, SearchChatDto } from "../models/chat";
import { store } from "./store";

let id = -10

export default class DirectStore {
    chats: ChatDto[] = [];
    searchResults: SearchChatDto[] = [];
    hubConnection: HubConnection | null = null;
    currentChat: ChatDto | null = null;
    channelInfos = new Map<string, ChannelDetailsDto>();
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

            this.hubConnection.on('ReceiveNewMessage', (result: Message) => {
                console.log('hey')
                this.addNewMessage(result);
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
            this.currentChat = chat;
            this.updateMessages();
        })
    }

    getChannelChatDetails = async (chat: ChatDto) => {
        const response = await agent.Chats.getChannelDetails(chat.id);
        
        runInAction(() => {
            this.channelInfos.set(chat.id, response);
            this.currentChat = chat;
        })
    }

    getChatDetails = async (chat: ChatDto) => {
        switch(chat.type) {
            case 0:
                await this.getPrivateChatDetails(chat);
                break;
            case 2:
                await this.getChannelChatDetails(chat);
                break;
        }
    }
    
    createLocalMessage = (body: string) => {
        if(!this.currentChat)
            return -1

        this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, 
            {
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
            }];
        
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
        this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, msg];
        
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

        this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, msg];
        
        id--;
        return {id:id + 1, msg};
    }

    addNewMessage = (response: Message) => {
        if(this.currentChat && this.currentChat.privateChat) {
            response.createdAt = new Date(response.createdAt);
            this.currentChat.privateChat.messages = [...this.currentChat.privateChat.messages, response];
            this.updateMessages();
        }
    }

    updateLocalMessage = (response: Message, id: number) => {
        if(this.currentChat) {
            const msg = this.currentChat.privateChat!.messages.find(x => x.id === id)
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

    createPrivateChat = async (username: string, body: string) => {
        try {
            if(!this.currentChat)
                return;

            const response = await agent.Chats.createPrivateChat(username, body);
            this.setChat({...this.currentChat, id: response.chatId});
            runInAction(() => {
                if(this.currentChat)
                    this.currentChat.privateChat = {messages: [response.message]};
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

    getChannelDetails = async (id: string) => {
        try {
            const response = await agent.Chats.getChannelDetails(id);

            runInAction(() => this.channelInfos.set(id, response));
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
        this.currentChat?.privateChat?.messages.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime());

        this.images = []
        this.videos = []
        this.currentChat?.privateChat?.messages.forEach(x => {
            switch(x.type) {
                case 1:
                    this.images.push({src: x.url, caption: x.body ? x.body : "No comment", id: x.id});
                    break;
                case 2:
                    this.videos.push(x.url);
            }
        })
    }

    getImageIndex = (id: number) => {
        return this.images.findIndex(x => x.id === id);
    }
}