import { createContext, useContext } from 'react';
import ActivityStore from './activityStore';
import ChatStore from './chatStore';
import CommentStore from './commentStore';
import CommonStore from './commonStore';
import ContactsStore from './contactsStore';
import DirectStore from './directStore';
import GroupStore from './groupStore';
import ModalStore from './modalStore';
import NotificationStore from './notificationStore';
import PhotoStore from './photoStore';
import ProfileStore from './profileStore';
import SettingsStore from './settingsStore';
import UserStore from './userStore';

interface Store {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    commentStore: CommentStore;
    notificationStore: NotificationStore;
    directStore: DirectStore;
    groupStore: GroupStore;
    chatStore: ChatStore;
    settingsStore: SettingsStore;
    photoStore: PhotoStore;
    contactsStore: ContactsStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore(),
    notificationStore: new NotificationStore(),
    directStore: new DirectStore(),
    groupStore: new GroupStore(),
    chatStore: new ChatStore(),
    settingsStore: new SettingsStore(),
    photoStore: new PhotoStore(),
    contactsStore: new ContactsStore()
};

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
