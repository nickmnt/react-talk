import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Profile } from '../models/profile';
import { store } from './store';

export default class SettingsStore {
    profile: Profile | null = null;
    loadingName = false;
    loadingBio = false;

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

    updateName = async (displayName: string) => {
        if (this.profile && this.profile.displayName === displayName) {
            return;
        }
        this.loadingName = true;
        try {
            await agent.Profiles.editName(displayName);
            runInAction(() => {
                if (this.profile) {
                    this.profile.displayName = displayName;
                }
                this.loadingName = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.loadingName = false));
        }
    };

    updateBio = async (bio: string) => {
        if (this.profile && this.profile.bio === bio) {
            return;
        }
        this.loadingBio = true;
        try {
            await agent.Profiles.editBio(bio);
            runInAction(() => {
                if (this.profile) {
                    this.profile.bio = bio;
                }
                this.loadingBio = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => (this.loadingBio = false));
        }
    };

    removePhoto = (id: string) => {
        if (!this.profile) return;
        this.profile.photos! = this.profile.photos!.filter((x) => x.id !== id);
    };

    setMainPhoto = (id: string) => {
        if (!this.profile) return;
        this.profile.photos!.forEach((x) => {
            if (x.id === id) {
                x.isMain = true;
            } else {
                x.isMain = false;
            }
        });
    };
}
