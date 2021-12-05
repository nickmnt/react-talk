import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ChannelDetailsDto, ChatDto, createLocalChat, SearchChatDto } from "../models/chat";
import { store } from "./store";

export default class DirectStore {
    chats: ChatDto[] = [];
    searchResults: SearchChatDto[] = [];
    hubConnection: HubConnection | null = null;
    currentChat: ChatDto | null = null;
    channelInfos = new Map<string, ChannelDetailsDto>();

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
            this.currentChat = chat;
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

    createMessage = async (body: string) => {
        if(!this.currentChat)
            return;
        const response = await agent.Chats.createMessage(body, this.currentChat.id);
        runInAction(() => {
            if(this.currentChat)
                this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, response];
        })
    }

    createPhoto = async (file: Blob, body: string) => {
        if(!this.currentChat)
            return;
        const response = await agent.Chats.createPhoto(file ,body, this.currentChat.id);
        runInAction(() => {
            if(this.currentChat)
                this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, response.data];
        })
    }

    createVideo = async (file: Blob, body: string) => {
        if(!this.currentChat)
            return;
        const response = await agent.Chats.createVideo(file ,body, this.currentChat.id);
        runInAction(() => {
            if(this.currentChat)
                this.currentChat.privateChat!.messages = [...this.currentChat.privateChat!.messages, response.data];
        })
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
}