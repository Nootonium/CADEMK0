import {
    RepositoryIdToChannelIdLink,
    RepositoryIdToChannelId,
} from "../../models/repositoryIdToChannelId";
import { logger } from "../../logger";

class RepositoryIdToChannelIdMap {
    async setMapping(link: RepositoryIdToChannelIdLink): Promise<void> {
        try {
            const existingMapping = await RepositoryIdToChannelId.findOne({
                repoId: link.repoId,
            });
            if (existingMapping) {
                existingMapping.channelId = link.channelId;
                await existingMapping.save();
            } else {
                const newMapping = new RepositoryIdToChannelId(link);
                await newMapping.save();
            }
        } catch (error) {
            logger.error(`Error setting mapping: ${error}`);
        }
    }
    async getMapping(repoId: string): Promise<RepositoryIdToChannelIdLink | null> {
        try {
            const mapping = await RepositoryIdToChannelId.findOne({ repoId: repoId });
            return mapping;
        } catch (error) {
            logger.error(`Error getting mapping: ${error}`);
            return null;
        }
    }

    async getChannelId(repoId: string): Promise<string | null> {
        const mapping = await this.getMapping(repoId);
        return mapping ? mapping.channelId : null;
    }
}

export const repositoryIdToChannelIdMap = new RepositoryIdToChannelIdMap();
