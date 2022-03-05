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
}
