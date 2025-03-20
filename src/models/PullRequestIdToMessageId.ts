import { Schema, model } from "mongoose";

const pullRequestIdToMessageIdSchema = new Schema(
    {
        pullRequestId: { type: String, required: true, unique: true },
        messageId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const PullRequestIdToMessageId = model(
    "PullRequestIdToMessageId",
    pullRequestIdToMessageIdSchema
);

export interface PullRequestIdToMessageIdLink {
    pullRequestId: string;
    messageId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export { PullRequestIdToMessageId };
