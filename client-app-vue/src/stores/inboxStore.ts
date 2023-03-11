import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { defineStore } from "pinia";

import agent from "../api/agent";
import { ChatDto } from "../models/chat";
import { Pagination, PagingParams } from "../models/pagination";
import { useUserStore } from "./userStore";

export type InboxState = {
  hubConnection: HubConnection | null;
  isConnected: boolean;
  pagingParams: PagingParams;
  pagination: Pagination | null;
  chats: ChatDto[];
  loadingChats: boolean;
};

export const useInboxStore = defineStore("inbox", {
  state: () => {
    return {
      hubConnection: null,
      isConnected: false,
      pagingParams: new PagingParams(),
      pagination: null,
      chats: [],
      loadingChats: true,
    } as InboxState;
  },
  actions: {
    createHubConnection() {
      const userStore = useUserStore();
      if (userStore.token) {
        this.hubConnection = new HubConnectionBuilder()
          .withUrl("http://localhost:5000/direct", {
            accessTokenFactory: () => userStore.token!,
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        const markConnected = () => (this.isConnected = true);
        const markDisconnected = () => (this.isConnected = false);

        this.hubConnection
          .start()
          .then(() => {
            markConnected();
          })
          .catch((error) => console.log("Error establishing the connection"));

        this.hubConnection.onreconnected(() => {
          markConnected();
        });

        this.hubConnection.onreconnecting(() => {
          markDisconnected();
        });
      }
    },
    async loadChats() {
      try {
        const result = await agent.Chats.list(this.axiosParams);
        const chats = result.data;
        this.setPagination(result.pagination);
        chats.forEach((x) => {
          if (x.lastMessage) {
            x.lastMessage.createdAt = new Date(x.lastMessage?.createdAt + "Z");
          }
          x.lastSeen = new Date(x.lastSeen + "Z");
        });
        this.chats = [...this.chats, ...chats];
        this.loadingChats = false;
      } catch (error) {
        console.log(error);
      }
    },
    setPagingParams(pagingParams: PagingParams) {
      this.pagingParams = pagingParams;
    },
    setPagination(pagination: Pagination) {
      this.pagination = pagination;
    },
  },
  getters: {
    axiosParams(state) {
      const params = new URLSearchParams();
      params.append("pageNumber", state.pagingParams.pageNumber.toString());
      params.append("pageSize", state.pagingParams.pageSize.toString());
      return params;
    },
  },
});
