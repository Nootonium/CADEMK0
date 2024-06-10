import { PullRequest, PullRequestStatus } from "../github/pullRequest/pullRequest";
import { htmlToText } from "html-to-text";

function formatStatusEmoji(status: PullRequestStatus): string {
    switch (status) {
        case PullRequestStatus.Open:
            return "🟢"; // Green circle for open
        case PullRequestStatus.Closed:
            return "🔴"; // Red circle for closed
        case PullRequestStatus.Merged:
            return "🔵"; // Blue circle for merged
        default:
            return "⚪"; // White circle for unknown status
    }
}

function formatPRMessageForDiscord(pr: PullRequest): string {
    const maxMessageLength = 2000;
    const statusEmoji = formatStatusEmoji(pr.status);

    let initialMessage: string; 
    let description: string;

    if (pr.author === "dependabot[bot]") {
        initialMessage = `Ah, the diligent ${pr.author} has proposed an automated update.\n**Title:** [${pr.title}](${pr.html_url})\n**Status:** ${statusEmoji} ${pr.status}\n**Description:** `;
        description = htmlToText(pr.description, {
            wordwrap: false,
        });
    } else {
        initialMessage = `Ah, the digital ethers have whispered to me of a new endeavor, a pull request by **${pr.author}**, upon the vast tapestry of our codebase.\n**Title:** [${pr.title}](${pr.html_url})\n**Status:** ${statusEmoji} ${pr.status}\n**Description:** `;
        description = pr.description;
    }

    const availableLength = maxMessageLength - initialMessage.length;
    let truncatedDescription = description;

    if (description.length > availableLength) {
        truncatedDescription = description.substring(0, availableLength - 3) + "...";
    }

    return initialMessage + truncatedDescription;
}

export { formatPRMessageForDiscord };