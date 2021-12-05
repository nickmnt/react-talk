export interface ChatDto {
    id: string;
    type: number;
    privateChatId: string;
    displayName: string;
    username: string;
    image: string;
    privateChat: PrivateChat | null;
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
    type: number;
    username: string;
    displayName: string;
    image: string;
    body: string;
    publicId: string;
    url: string;
    createdAt: Date;
}

export interface ChannelDetailsDto {
    description: string;
    memberCount: number;
}

export interface PrivateChatResultDto {
    chatId: string;
    message: Message;
}

export const createLocalChat = (username: string, displayName: string, image: string) => {
    const privateChat = {messages: []};
    return { id: '', type: -10, privateChatId: '', displayName, image, privateChat, username} as ChatDto;
}