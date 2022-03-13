import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { store } from './store';

export default class PhotoStore {
    photoOpen = false;
    uploading = false;
    step = 0;
    isGroup = false;

    constructor() {
        makeAutoObservable(this);
    }

    setStep = (value: number) => {
        this.step = value;
    };

    setPhotoOpen = (value: boolean, isGroup: boolean = false) => {
        if (value === true) {
            this.step = 0;
            this.uploading = false;
            this.isGroup = isGroup;
        }
        this.photoOpen = value;
    };

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            store.settingsStore.updateImage(response.data.url);
            runInAction(() => {
                this.uploading = false;
                this.photoOpen = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.uploading = false;
                this.photoOpen = false;
            });
        }
    };
}
