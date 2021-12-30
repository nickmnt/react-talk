import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { ChatDto, ChatPage } from "../models/chat";

export default class ChatStore {
    stack: ChatPage[] = [];
    i = 0;

    constructor() {
        makeAutoObservable(this);
    }

    addDetailsToStack = async (val: ChatDto) => {
        if(val.type === 0) {
            try {
                var response = await agent.Profiles.get(val.privateChat!.otherUsername);                
                this.stack = [...this.stack, {type: val.type, accountData: response, index: this.i}];
                this.i += 1
            } catch(error) {
                console.log('error', error)
            }
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
        try {
            var response = await agent.Profiles.get(username);                
            this.stack = [...this.stack, {type: 0, accountData: response, index: this.i}];
            this.i += 1
        } catch(error) {
            console.log('error', error)
        }
    }

    removeFromStack = (val: ChatPage) => {
        this.stack = this.stack.filter(x => x.index !== val.index);
    }
}