export interface CreateUser {
    username?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phoneNumber?: string;
    profilePictureKey?: string;
    password?: string;
    googleId?: string;
}
