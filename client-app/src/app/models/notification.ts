export interface JoinNotification {
    username: string;
    image: string;
    activityId: string;
    createdAt: Date;
}

export interface FollowNotification {
    followerUsername: string;
    followerImage: string;
    createdAt: Date;
}

export interface CommentNotification {
    username: string;
    image: string;
    activityId: string;
    createdAt: Date;
}

export interface NotificationsDto {
    joinNotifications: JoinNotification[];
    followNotifications: FollowNotification[];
    commentNotifications: CommentNotification[];
}