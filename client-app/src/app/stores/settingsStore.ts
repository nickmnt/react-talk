import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Profile } from '../models/profile';
import { store } from './store';

export default class SettingsStore {
    profile: Profile | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    loadProfile = async () => {
        if (!store.userStore.user) {
            return;
        }
        try {
            const response = await agent.Profiles.get(store.userStore.user.username);
            runInAction(() => {
                this.profile = response;
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateImage = (src: string) => {
        if (!this.profile) return null;
        this.profile.image = src;
    };
}
