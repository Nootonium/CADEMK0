import { InferSchemaType, Schema, model } from "mongoose";

const notificationChannelSchema = new Schema(
    {
        channelId: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

type NotificationChannel = InferSchemaType<typeof notificationChannelSchema>;
const NotificationChannelModel = model<NotificationChannel>(
    "NotificationChannelSchema",
    notificationChannelSchema
);

export { NotificationChannelModel, NotificationChannel };
