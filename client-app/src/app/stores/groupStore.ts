import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Profile } from "../models/profile";
import { store } from "./store";

export default class GroupStore {
    members: Profile[] = [];
    followings: Profile[] = [];
    loadingFollowings = true;
    type = '';
    editing = false;
    phase = 0;
    name = '';
    description = '';

    constructor() {
        makeAutoObservable(this);
    }

    startEditing = () => {
        this.members = [];
        this.phase = 0;
        this.editing = true;
    }

    stopEditing = () => {
        this.editing = false;
    }

    startCreateGroup = () => {
        this.startEditing();
        this.name = '';
        this.type = 'group';
    }

    startCreateChannel = () => {
        this.startEditing();
        this.name = '';
        this.description = '';
        this.type = 'channel';
    }

    setName = (val: string) => {
        this.name = val;
    }

    setDescription = (val: string) => {
        this.description = val;
    }

    loadFollowings = async () => {
        const user = store.userStore.user;

        if(!user)
            return;

        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(user.username, 'following');
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            });
        } catch(error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }

    toggleMember = (profile: Profile) => {
        if(this.members.find(x => x.username === profile.username)) {
            this.members = this.members.filter(x => x.username !== profile.username);
        } else {
            this.members = [...this.members, profile];
        }
    }

    nextPhase = () => {
        this.phase++;
    }

    previousPhase = () => {
        this.phase--;
    }
}