import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Profile } from '../models/profile';
import { store } from './store';

export default class ContactsStore {
    followings: Profile[] | null = null;
    loadingFollowings = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadFollowings = async () => {
        if (store.userStore.user) {
            try {
                this.loadingFollowings = true;
                const response = await agent.Profiles.listFollowings(store.userStore.user.username, 'following');
                response.forEach((x) => (x.lastSeen = new Date(x.lastSeen + 'Z')));
                runInAction(() => {
                    this.followings = response;
                    this.loadingFollowings = false;
                });
            } catch (error) {
                console.log(error);
                runInAction(() => {
                    this.loadingFollowings = false;
                });
            }
        }
    };

    isFollowing = (username: string) => {
        return this.followings && !!this.followings.find((x) => x.username === username);
    };

    removeFollowing = (username: string) => {
        if (!this.followings) return;
        this.followings = this.followings.filter((x) => x.username !== username);
    };

    addFollowing = (profile: Profile) => {
        if (!this.followings) return;
        this.followings = [...this.followings, profile];
    };
}
