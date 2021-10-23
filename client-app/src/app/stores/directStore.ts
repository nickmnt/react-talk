import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatDto, createLocalChat, SearchChatDto } from "../models/chat";
import { store } from "./store";

export default class DirectStore {
    chats: ChatDto[] = [];
    searchResults: SearchChatDto[] = [];
    hubConnection: HubConnection | null = null;
    currentChat: ChatDto | null = null;

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

    setLocalChat = (displayName: string, image: string) => {
        this.currentChat = createLocalChat(displayName, image);
    }
}