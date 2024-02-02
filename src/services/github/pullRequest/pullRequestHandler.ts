import { PullRequest } from "./pullRequest";
import { pullRequestIdToMessageIdMap } from "../../repositories/PRMessageRepository";
import { formatPRMessageForDiscord } from "../../discord/formatPRMessageForDiscord";
import { sendMessageToChannel, updateMessageInChannel } from "../../discord/messaging";
import { repositoryIdToChannelIdMap } from "../../repositories/RepoChannelRepository";
import { logger } from "../../../logger";

async function processPullRequestUpdate(pullRequest: PullRequest) {
    console.log("Processing pull request:\n", pullRequest);
    const newPRMessage = formatPRMessageForDiscord(pullRequest);
    const channelId = await repositoryIdToChannelIdMap.getChannelId(pullRequest.repoId);
    if (!channelId) {
        logger.error(`No channelId found for repoId: ${pullRequest.repoId}`);
        return;
    }
    let messageId = await pullRequestIdToMessageIdMap.getMessageId(pullRequest.id);
    if (!messageId) {
        messageId = await sendMessageToChannel(channelId, newPRMessage);
        if (!messageId) {
            return;
        }
        pullRequestIdToMessageIdMap.setMapping({
            pullRequestId: pullRequest.id,
            messageId: messageId,
        });
    } else {
        // if state is closed or merged, update message in discord and delete mapping
        await updateMessageInChannel(channelId, messageId, newPRMessage);
        if (pullRequest.status !== "open") {
            await pullRequestIdToMessageIdMap.deleteMapping(pullRequest.id);
        }
    }
}

export default processPullRequestUpdate;
