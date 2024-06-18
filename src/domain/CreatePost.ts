export interface CreatePost {
    urlKey: string;
    description?: string;
    keywords?: string[];
    mentions?: string[];
    userId: string;
}
