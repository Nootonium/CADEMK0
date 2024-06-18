import { Schema, model } from "mongoose";
import { Message as IMessage } from "../types";

const messageSchema = new Schema<IMessage>(
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

const Message = model<IMessage>("Message", messageSchema);

export default Message;
