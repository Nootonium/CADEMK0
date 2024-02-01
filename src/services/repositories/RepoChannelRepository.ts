import { RepoChannelLink, RepoToChannel } from "../../models/repoToChannel";
import { logger } from "../../logger";

class RepoChannelRepository {
    async setMapping(link: RepoChannelLink): Promise<void> {
        try {
            const existingMapping = await RepoToChannel.findOne({
                repoId: link.repoId,
            });
            if (existingMapping) {
                existingMapping.channelId = link.channelId;
                await existingMapping.save();
            } else {
                const newMapping = new RepoToChannel(link);
                await newMapping.save();
            }
        } catch (error) {
            logger.error(`Error setting mapping: ${error}`);
        }
    }
    async getMapping(repoId: string): Promise<RepoChannelLink | null> {
        try {
            const mapping = await RepoToChannel.findOne({ repoId: repoId });
            return mapping;
        } catch (error) {
            logger.error(`Error getting mapping: ${error}`);
            return null;
        }
    }
}

export const repoChannelRepository = new RepoChannelRepository();
