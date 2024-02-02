import { PullRequestIdToMessageId, PullRequestIdToMessageIdLink } from "../../models/pullRequestIdToMessageId";
import { logger } from "../../logger";

class PullRequestIdToMessageIdMap {
    async setMapping(link: PullRequestIdToMessageIdLink): Promise<void> {
        try {
            const existingMapping = await PullRequestIdToMessageId.findOne({
                pullRequestId: link.pullRequestId,
            });
            if (existingMapping) {
                existingMapping.messageId = link.messageId;
                await existingMapping.save();
            } else {
                const newMapping = new PullRequestIdToMessageId(link);
                await newMapping.save();
            }
        } catch (error) {
            logger.error(`Error setting mapping: ${error}`);
        }
    }
    async getMapping(pullRequestId: string): Promise<PullRequestIdToMessageIdLink | null> {
        try {
            const mapping = await PullRequestIdToMessageId.findOne({ pullRequestId: pullRequestId });
            return mapping;
        } catch (error) {
            logger.error(`Error getting mapping: ${error}`);
            return null;
        }
    }
    async deleteMapping(pullRequestId: string): Promise<void> {
        try {
            await PullRequestIdToMessageId.deleteOne({
                pullRequestId: pullRequestId,
            });
        } catch (error) {
            logger.error(`Error deleting mapping: ${error}`);
        }
    }
}

export const pullRequestIdToMessageIdMap = new PullRequestIdToMessageIdMap();
