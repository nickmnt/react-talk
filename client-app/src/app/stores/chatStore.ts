import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ChatDto, ChatPage } from "../models/chat";
import { store } from "./store";

export default class ChatStore {
    stack: ChatPage[] = [];
    i = 0;

    constructor() {
        makeAutoObservable(this);
    }

    addDetailsToStack = async (val: ChatDto) => {
        if(val.type === 0) {  
            this.addProfileDetailsToStack(val.privateChat!.otherUsername);
        } else if(val.type === 1) {
            try {
                this.stack = [...this.stack, {type: val.type, groupData: val, index: this.i}];
                this.i +=1
            } catch(error) {
                console.log('error', error)
            }
        } else if(val.type === 2) {
            try {
                this.stack = [...this.stack, {type: val.type, channelData: val, index: this.i}];
                this.i +=1
            } catch(error) {
                console.log('error', error)
            }
        }
    }

    addProfileDetailsToStack = async (username: string) => {
        this.stack = [...this.stack, {type: 0, index: this.i}];
            try {
                var response = await agent.Profiles.get(username);                
                this.stack = [...this.stack.filter(x => x.index !== this.i),  {type: 0, accountData: response, index: this.i}];
                this.i += 1
            } catch(error) {
                console.log('error', error)
            }
    }

    removeFromStack = (val: ChatPage) => {
        this.stack = this.stack.filter(x => x.index !== val.index);
    }

    addAddMembersToStack = async (val: ChatDto) => {
        switch(val.type) {
            case 1:
                this.stack = [...this.stack.filter(x => x.index !== this.i),  {type: 21, groupData: val, index: this.i}];
                try {
                    const followings = await agent.Profiles.listFollowings(store.userStore.user!.username, 'following');
                    runInAction(() => {
                        this.stack = [...this.stack.filter(x => x.index !== this.i),  {type: 21, groupData: val, followings: followings, index: this.i}];
                        this.i += 1
                    })
                } catch(error) {
                    console.log(error)
                    runInAction(() => {
                        this.stack = [...this.stack.filter(x => x.index !== this.i)];
                    })
                }
                break;
            case 2:
                this.stack = [...this.stack.filter(x => x.index !== this.i),  {type: 21, channelData: val, index: this.i}];
                try {
                    const followings = await agent.Profiles.listFollowings(store.userStore.user!.username, 'following');
                    runInAction(() => {
                        this.stack = [...this.stack.filter(x => x.index !== this.i),  {type: 21, channelData: val, followings: followings, index: this.i}];
                        this.i += 1
                    })
                } catch(error) {
                    console.log(error)
                    runInAction(() => {
                        this.stack = [...this.stack.filter(x => x.index !== this.i)];
                    })
                }
                break;
        }
    }
}