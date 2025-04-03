import { Schema, model } from "mongoose";
import { Session as ISession } from "../types";

const eventSchema = new Schema(
    {
        eventType: {
            type: String,
            required: true,
            enum: ["section", "click", "click_link"],
        },
        eventData: { type: Schema.Types.Mixed, required: true },
    },
    { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const sessionSchema = new Schema<ISession>(
    {
        sessionId: { type: String, required: true, unique: true },
        referralSource: { type: String, default: "direct" },
        userAgent: { type: String, required: true },
        events: { type: [eventSchema], default: [] },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

const Session = model<ISession>("Session", sessionSchema);

export default Session;
