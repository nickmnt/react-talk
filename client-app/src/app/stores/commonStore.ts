import { makeAutoObservable, reaction } from "mobx";

export default class CommonStore {
    error: string | null = null;
    token: string | null = window.localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        //Doesn't run when initialized
        reaction(
            () => this.token,
            token => {
                if(token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    setServerError = (error: string) => {
        this.error = error;
    }

    setToken = (token: string | null) => {
        if(token) {
            this.token = token;
        }
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}