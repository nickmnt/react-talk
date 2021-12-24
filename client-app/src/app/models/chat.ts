import { Profile } from "./profile";

export interface ChatDto {
    id: string;
    type: number;
    privateChatId: string;
    displayName: string;
    username: string;
    image: string;
    privateChat?: PrivateChat | null;
    groupChat?: GroupDetailsDto | null;
    channelChat?: ChannelDetailsDto | null;
}

export interface SearchChatDto {
    username: string;
    displayName: string;
    image: string
}

export interface PrivateChat {
    messages: Message[];
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
    memberCount: number;
    messages: Message[];
}

export interface GroupDetailsDto {
    description: string;
    memberCount: number;
    messages: Message[];
}

export interface PrivateChatResultDto {
    chatId: string;
    message: Message;
}

export interface ChatPage {
    type: number;
    accountData: Profile;
    index: number;
}

export interface ImageElem{
    id: number
    src: string,
    caption: string
}

export const createLocalChat = (username: string, displayName: string, image: string) => {
    const privateChat = {messages: []};
    return { id: '', type: -10, privateChatId: '', displayName, image, privateChat, username} as ChatDto;
}