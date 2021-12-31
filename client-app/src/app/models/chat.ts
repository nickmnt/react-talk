import { Profile } from "./profile";

export interface ChatDto {
    id: string;
    type: number;
    privateChatId: string;
    displayName: string;
    image: string;
    privateChat?: PrivateChat | null;
    groupChat?: GroupDetailsDto | null;
    channelChat?: ChannelDetailsDto | null;
}

export interface SearchChatDto {
    username: string;
    displayName: string;
    image: string;
}

export interface PrivateChat {
    messages: Message[];
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
}

export interface ChannelDetailsDto {
    description: string;
    members: ChannelMember[];
    memberCount?: number;
    messages: Message[];
    me?: GroupMember;
}

export interface GroupDetailsDto {
    description: string;
    members: GroupMember[];
    memberCount?: number;
    messages: Message[];
    me?: GroupMember;
}

export interface GroupMember {
    memberType: number;
    displayName: string;
    username: string;
    image: string;
    lastSeen: Date;
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
    index: number;
}

export interface ImageElem{
    id: number
    src: string,
    caption: string
}

export interface UpdatedSeenDto {
    chatId: string;
    username: string;
    lastSeen: Date;
}

export interface MessageNotifDto {
    message: Message;
    chatId: string;
}

export const createLocalChat = (username: string, displayName: string, image: string) => {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    const privateChat = {messages: [], myLastSeen: date, otherLastSeen: date, otherUserId: '', otherUsername: username};
    return { id: '', type: -10, privateChatId: '', displayName, image, privateChat} as ChatDto;
}