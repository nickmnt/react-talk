export interface ChatDto {
    id: string;
    type: string;
    privateChatId: string;
    displayName: string;
    image: string;
}

export interface SearchChatDto {
    username: string;
    displayName: string;
    image: string;
}