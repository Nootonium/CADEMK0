import { Schema, model } from "mongoose";

const repositoryIdToChannelIdSchema = new Schema(
    {
        repoId: { type: String, required: true, unique: true },
        channelId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const RepositoryIdToChannelId = model(
    "RepositoryIdToChannelId",
    repositoryIdToChannelIdSchema
);

export interface RepositoryIdToChannelIdLink {
    repoId: string;
    channelId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export { RepositoryIdToChannelId };
