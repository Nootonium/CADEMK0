import { Document } from "mongoose";

export interface Message extends Document {
    name: string;
    email: string;
    message: string;
    responded: boolean;
    viewed: boolean;
    category: string;
}
