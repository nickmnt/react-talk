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
                var response = await agent.Profiles.get(val.displayName);                
                this.stack = [...this.stack, {type: val.type, accountData: response, index: this.i}];
            } catch(error) {
                console.log('error', error)
            }
        }
    }

    removeFromStack = (val: ChatPage) => {
        this.stack = this.stack.filter(x => x.index !== val.index);
    }
}