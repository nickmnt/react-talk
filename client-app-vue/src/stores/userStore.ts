import { defineStore } from "pinia";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";

export type UserState = {
  user: User | null;
  token: string | null;
};

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null,
      token: window.localStorage.getItem("jwt"),
    } as UserState;
  },
  actions: {
    async register(creds: UserFormValues) {
      try {
        const user = await agent.Account.register(creds);
        this.token = user.token;
        window.localStorage.setItem("jwt", this.token);
        this.user = user;
        this.router.push("/inbox/");
      } catch (error) {
        throw error;
      }
    },
    async login(creds: UserFormValues) {
      try {
        const user = await agent.Account.login(creds);
        this.token = user.token;
        window.localStorage.setItem("jwt", this.token);
        this.user = user;
        this.router.push("/inbox/");
      } catch (error) {
        throw error;
      }
    },
    async getUser() {
      try {
        const user = await agent.Account.current();
        this.user = user;
        this.router.push("/inbox/");
      } catch (error) {
        console.log(error);
      }
    },
  },
});
