import { Schema, model } from "mongoose";

const repoToChannelSchema = new Schema(
    {
        repoId: { type: String, required: true, unique: true },
        channelId: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const RepoToChannel = model("RepoToChannel", repoToChannelSchema);

export interface RepoChannelLink {
    repoId: string;
    channelId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export { RepoToChannel };
