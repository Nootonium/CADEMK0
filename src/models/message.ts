import { Schema, model } from "mongoose";
import { Message } from "../types";

const messageSchema = new Schema<Message>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        responded: { type: Boolean, default: false },
        viewed: { type: Boolean, default: false },
        category: { type: String, default: "uncategorized" },
    },
    {
        timestamps: true,
    }
);

const Message = model<Message>("Message", messageSchema);

export default Message;
