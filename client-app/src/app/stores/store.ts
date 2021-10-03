import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommentStore from "./commentStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import NotificationStore from "./notificationStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";

interface Store {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    commentStore: CommentStore;
    notificationStore: NotificationStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(), 
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore(),
    notificationStore: new NotificationStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}