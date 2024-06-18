export interface CreateReaction {
    postId: string;
    postUserId: string;
    reactingUserId: string;
    type?: string;
    content?: string;
    read?: boolean;
}
