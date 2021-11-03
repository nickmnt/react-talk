export interface ChatDto {
    id: string;
    type: string;
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
    username: string;
    displayName: string;
    image: string;
    body: string;
    createdAt: Date;
}

export interface PrivateChatResultDto {
    chatId: string;
    message: Message;
}

export const createLocalChat = (username: string, displayName: string, image: string) => {
    const privateChat = {messages: []};
    return { id: '', type: 'localPrivate', privateChatId: '', displayName, image, privateChat, username} as ChatDto;
}