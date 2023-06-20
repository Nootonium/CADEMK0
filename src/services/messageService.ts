import { buildGptPrompt, getCompletion } from "../utils/gpt";
// import { sendEmail } from "../utils/sendEmail";
import Message from "../models/message";
import { OpenAiCompletionParams } from "../types";
import { logger } from "../logger";

interface RequestMessage {
    name: string;
    email: string;
    message: string;
}

async function saveNewMessage({ name, email, message }: RequestMessage) {
    const newMessage = new Message({
        name,
        email,
        message,
    });
    await newMessage.save();
}



export { saveNewMessage };
