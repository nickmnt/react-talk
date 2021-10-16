import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatDto } from "../models/chat";
import { store } from "./store";

export default class DirectStore {
    chats: ChatDto[] = [];
    hubConnection: HubConnection | null = null;

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
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

    clearChats = () => {
        this.chats = [];       
        this.stopHubConnection();
    }

}