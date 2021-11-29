import { makeAutoObservable } from "mobx";

export default class GroupStore {
    members = [];
    type = '';
    editing = false;
    phase = 0;

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
        this.type = 'group';
    }

    startCreateChannel = () => {
        this.startEditing();
        this.type = 'channel';
    }
}