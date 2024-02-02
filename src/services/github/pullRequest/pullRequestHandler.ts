import { PullRequest } from "./pullRequest";
import { pullRequestIdToMessageIdMap } from "../../repositories/PRMessageRepository";
import { formatPRMessageForDiscord } from "../../discord/formatPRMessageForDiscord";
import { sendMessageToChannel, updateMessageInChannel } from "../../discord/messaging";
import { repositoryIdToChannelIdMap } from "../../repositories/RepoChannelRepository";
import { logger } from "../../../logger";

async function isNewPullRequest(pullRequest: PullRequest) {
    return (
        pullRequest.status === "open" &&
        await pullRequestIdToMessageIdMap.getMapping(pullRequest.id) === null
    );
}

async function processPullRequestUpdate(pullRequest: PullRequest) {
    const newPRMessage = formatPRMessageForDiscord(pullRequest);
    const mapping = await repositoryIdToChannelIdMap.getMapping(pullRequest.repoId);
    if (!mapping) {
        logger.error(`No channel mapping found for repoId: ${pullRequest.repoId}`);
        return;
    }
    // Process the pull request
    if (await isNewPullRequest(pullRequest)) {
        console.log("New pull request");
        const messageId = await sendMessageToChannel(mapping.channelId, newPRMessage);
        if (!messageId) {
            return;
        }
        pullRequestIdToMessageIdMap.setMapping({
            pullRequestId: pullRequest.id,
            messageId: messageId,
        });
    } else {
        console.log("Existing pull request");
        const existingMapping = await pullRequestIdToMessageIdMap.getMapping(pullRequest.id);
        console.log(existingMapping);
        if (!existingMapping) {
            return;
        }
        await updateMessageInChannel(mapping.channelId, existingMapping.messageId, newPRMessage);
        // if state is closed or merged, update message in discord and delete mapping
        if (pullRequest.status !== "open") {
            pullRequestIdToMessageIdMap.deleteMapping(pullRequest.id);
        }
    }
}

export default processPullRequestUpdate;
