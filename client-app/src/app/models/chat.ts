import { LboxImage } from 'r-lightbox';
import { Photo, Profile } from './profile';

export interface Pin {
    id: number;
    messageId: number;
    isMutual: boolean;
}

export interface ChatDto {
    id: string;
    type: number;
    displayName: string;
    image: string;
    privateChat?: PrivateChat | null;
    groupChat?: GroupDetailsDto | null;
    channelChat?: ChannelDetailsDto | null;
    lastMessage: Message | null;
    lastMessageSeen: boolean;
    notSeenCount: number;
    pins: Pin[];
    participantUsername: string | null;
    membershipType: number;
    messages?: Message[];
    lastSeen: Date;
    isOnline: boolean;
    typing?: boolean;
    typists?: Typist[];
}

export interface SearchChatDto {
    username: string;
    displayName: string;
    image: string;
}

export interface PrivateChat {
    myLastSeen: Date;
    otherLastSeen: Date;
    otherUserId: string;
    otherUsername: string;
}

export interface Message {
    id: number;
    type: number;
    username: string;
    displayName: string;
    image: string;
    body: string;
    publicId: string;
    url: string;
    createdAt: Date;
    local: boolean;
    localBlob?: Blob;
    localProgress?: number;
    replyToId: number;
    forwardUsername: string;
    forwardDisplayName: string;
    beingDeleted?: boolean;
}

export interface ChannelDetailsDto {
    description: string;
    members: ChannelMember[];
    memberCount?: number;
    me?: ChannelMember;
}

export interface GroupDetailsDto {
    description: string;
    members: GroupMember[];
    memberCount?: number;
    me?: GroupMember;
    photos: Photo[];
    // All members permissions
    sendMessagesAll: boolean;
    sendMediaAll: boolean;
    addUsersAll: boolean;
    pinMessagesAll: boolean;
    changeChatInfoAll: boolean;
    // Specific member permissions
    sendMessages: boolean;
    sendMedia: boolean;
    addUsers: boolean;
    pinMessages: boolean;
    changeChatInfo: boolean;
    // Admin permissions
    deleteMessages: boolean;
    banUsers: boolean;
    addNewAdmins: boolean;
    remainAnonymous: boolean;
    customTitle: string;
}

export interface GroupMember {
    memberType: number;
    displayName: string;
    username: string;
    image: string;
    lastSeen: Date;
    // Member permissions
    sendMessages: boolean;
    sendMedia: boolean;
    addUsers: boolean;
    pinMessages: boolean;
    changeChatInfo: boolean;
    // Admin permissions
    deleteMessages: boolean;
    banUsers: boolean;
    addNewAdmins: boolean;
    remainAnonymous: boolean;
    customTitle: string;
    lastSeenOnline: Date;
    isOnline: boolean;
}

export interface ChannelMember {
    memberType: number;
    displayName: string;
    username: string;
    image: string;
    lastSeen: Date;
}

export interface PrivateChatResultDto {
    chatId: string;
    message: Message;
}

export interface ChatPage {
    type: number;
    accountData?: Profile;
    groupData?: ChatDto;
    channelData?: ChatDto;
    followings?: Profile[];
    member?: GroupMember;
    index: number;
    off?: boolean;
}

export interface ImageElem extends LboxImage {
    id: number;
}

export interface UpdatedSeenDto {
    chatId: string;
    username: string;
    lastSeen: Date;
}

export interface MessageNotifDto {
    message: Message;
    chatId: string;
    notSeenCount: number;
}

export interface GroupMemberPermissions {
    sendMessages: boolean;
    sendMedia: boolean;
    addUsers: boolean;
    pinMessages: boolean;
    changeChatInfo: boolean;
}

export interface AdminPermissions {
    deleteMessages: boolean;
    banUsers: boolean;
    addNewAdmins: boolean;
    remainAnonymous: boolean;
    customTitle: string;
}

export const createLocalChat = (username: string, displayName: string, image?: string) => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    const privateChat = { messages: [], myLastSeen: date, otherLastSeen: date, otherUserId: '', otherUsername: username };
    return {
        id: '',
        type: -10,
        privateChatId: '',
        displayName,
        image,
        privateChat,
        lastMessage: null,
        lastMessageSeen: false,
        notSeenCount: 0,
        pins: [],
        participantUsername: username,
        membershipType: 0,
        isOnline: false,
        lastSeen: new Date()
    } as ChatDto;
};

export const createLocalSavedChat = () => {
    return {
        id: '',
        type: -20,
        privateChatId: '',
        displayName: 'Saved Messages',
        image: '',
        lastMessage: null,
        lastMessageSeen: false,
        notSeenCount: 0,
        pins: [],
        participantUsername: '',
        membershipType: 0,
        isOnline: false,
        lastSeen: new Date()
    } as ChatDto;
};

export interface PhotoType extends File {
    preview: string;
}

export interface SearchResult {
    displayName: string;
    username: string;
    image: string | undefined;
    startIndexDisp: number;
    startIndexUser: number;
}

export interface ConnectedDto {
    username: string;
}

export interface DisconnectedDto {
    username: string;
    lastSeen: Date;
}

export interface TypingDto {
    username: string;
    displayName: string;
    chatId: string;
}

export interface Typist {
    username: string;
    displayName: string;
}
