import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/user';
import { store } from './store';

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => (this.user = user));
            if (store.directStore.navigate) store.directStore.navigate('/direct/inbox', { replace: true });
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        if (store.directStore.navigate) store.directStore.navigate('/', { replace: true });
    };

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            // console.log('logginedINUser', user);
            runInAction(() => (this.user = user));
        } catch (error) {
            console.log(error);
        }
    };

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => (this.user = user));
            if (store.directStore.navigate) store.directStore.navigate('/direct/inbox', { replace: true });
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    };

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    };

    setDisplayName = (displayName: string) => {
        if (this.user) {
            this.user.displayName = displayName;
        }
    };
}
