export interface GoogleProfile {
    id: string;
    displayName: string;
    name?: {
        givenName?: string;
        familyName?: string;
    };
    emails?: Array<{
        value: string;
    }>;
    photos?: Array<{
        value: string;
    }>;
}
