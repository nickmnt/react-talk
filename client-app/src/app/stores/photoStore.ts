import { makeAutoObservable, runInAction } from 'mobx';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { Photo } from '../models/profile';
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
        if (this.isGroup) {
            if (!store.directStore.currentChat || store.directStore.currentChat.type !== 1) {
                return;
            }
            this.uploading = true;
            try {
                const response = await agent.Photos.uploadPhotoGroup(file, store.directStore.currentChat.id);
                store.directStore.updateGroupPhoto(response.data);
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
        } else {
            this.uploading = true;
            try {
                const response = await agent.Profiles.uploadPhoto(file);
                store.settingsStore.updateImage(response.data);
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
        }
    };

    deletePhoto = async (photo: Photo) => {
        if (!store.settingsStore.profile) return;
        if (photo.isMain) {
            toast.error('Cannot delete your main photo.');
            return;
        }
        try {
            await agent.Profiles.deletePhoto(photo.id);
            store.settingsStore.removePhoto(photo.id);
        } catch (error) {
            console.log(error);
        }
    };

    deletePhotoGroup = async (photo: Photo, chatId: string) => {
        if (!store.settingsStore.profile) return;
        if (photo.isMain) {
            toast.error('Cannot delete the main photo.');
            return;
        }
        try {
            await agent.Photos.deletePhotoGroup(photo.id, chatId);
            store.directStore.deleteGroupPhoto(photo.id, chatId);
        } catch (error) {
            console.log(error);
        }
    };

    setMain = async (photo: Photo) => {
        if (!store.settingsStore.profile) return;

        if (photo.isMain) {
            toast.error('Set another photo as your main one instead.');
            return;
        }
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.settingsStore.setMainPhoto(photo.id);
        } catch (error) {
            console.log(error);
        }
    };

    setMainGroup = async (photo: Photo, chatId: string) => {
        if (!store.settingsStore.profile) return;

        if (photo.isMain) {
            toast.error('Set another photo as the main one instead.');
            return;
        }
        try {
            await agent.Photos.setMainPhotoGroup(photo.id, chatId);
            store.directStore.setGroupMainPhoto(photo.id, chatId, photo.url);
        } catch (error) {
            console.log(error);
        }
    };
}
