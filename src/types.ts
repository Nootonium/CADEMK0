import { Document } from "mongoose";

export interface Message extends Document {
    name: string;
    email: string;
    message: string;
    responded: boolean;
    viewed: boolean;
    category: string;
}

export interface OpenAiCompletionParams {
    model: string;
    prompt: string;
    suffix?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    n?: number;
    stream?: boolean;
    logprobs?: number;
    echo?: boolean;
    stop?: string;
    presence_penalty?: number;
    frequency_penalty?: number;
    best_of?: number;
    logit_bias?: { [key: string]: number };
    user?: string;
}

export interface Event {
    eventType: string;
    eventData: string;
}

export interface Session {
    sessionId: string;
    referralSource?: string;
    userAgent: string;
    events: Event[];
}
