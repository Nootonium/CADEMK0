export interface CreateMessage {
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
}
