import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { CommentNotification, FollowNotification, JoinNotification, NotificationsDto } from '../models/notification';
import { store } from './store';

export default class NotificationStore {
    joinNotifications: JoinNotification[] = [];
    followNotifications: FollowNotification[] = [];
    commentNotifications: CommentNotification[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = () => {
        if (store.userStore.user?.token) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/notification', {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch((error) => console.log('Error establishing the connection'));

            this.hubConnection.on('LoadNotifications', (notifications: NotificationsDto) => {
                runInAction(() => {
                    console.log('notificationsDto', notifications);
                    notifications.joinNotifications.forEach((notification) => {
                        notification.createdAt = new Date(notification.createdAt + 'Z');
                        notification.type = 'join';
                    });
                    notifications.commentNotifications.forEach((notification) => {
                        notification.createdAt = new Date(notification.createdAt + 'Z');
                        notification.type = 'comment';
                    });
                    notifications.followNotifications.forEach((notification) => {
                        notification.createdAt = new Date(notification.createdAt + 'Z');
                        notification.type = 'follow';
                    });

                    this.joinNotifications = notifications.joinNotifications;
                    this.commentNotifications = notifications.commentNotifications;
                    this.followNotifications = notifications.followNotifications;
                });
            });

            this.hubConnection.on('ReceiveCommentNotif', (comment: CommentNotification) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.commentNotifications.unshift(comment);
                });
            });
        }
    };

    stopHubConnection = () => {
        this.hubConnection?.stop().catch((error) => console.log('Error stopping connection: ', error));
    };

    clearNotifications = () => {
        this.commentNotifications = [];
        this.joinNotifications = [];
        this.followNotifications = [];

        this.stopHubConnection();
    };

    updateFollowing = (username: string) => {
        const x = this.followNotifications.find((x) => x.username === username);
        if (x) x.following = !x.following;
    };
}
