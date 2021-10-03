export interface JoinNotification {
    username: string;
    image: string;
    activityId: string;
    createdAt: Date;
    type: string;
}

export interface FollowNotification {
    username: string;
    image: string;
    following: boolean;
    createdAt: Date;
    type: string;
}

export interface CommentNotification {
    username: string;
    image: string;
    activityId: string;
    createdAt: Date;
    type: string;
}

export interface NotificationsDto {
    joinNotifications: JoinNotification[];
    followNotifications: FollowNotification[];
    commentNotifications: CommentNotification[];
}