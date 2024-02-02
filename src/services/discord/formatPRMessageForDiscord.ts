import { PullRequest, PullRequestStatus } from "../github/pullRequest/pullRequest";

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
    const statusEmoji = formatStatusEmoji(pr.status);
    return `Ah, the digital ethers have whispered to me of a new endeavor, a pull request by **${pr.author}**, upon the vast tapestry of our codebase.\n**Title:** [${pr.title}](${pr.html_url})\n**Description:** ${pr.description}\n**Status:** ${statusEmoji} ${pr.status}`;
}

export { formatPRMessageForDiscord };
