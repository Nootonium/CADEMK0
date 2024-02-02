import { PullRequest, PullRequestStatus } from "../github/pullRequest/pullRequest";

function formatPRMessageForDiscord(pr: PullRequest): string {
    let statusEmoji: string;
    switch (pr.status) {
        case PullRequestStatus.Open:
            statusEmoji = "🟢"; // Green circle for open
            break;
        case PullRequestStatus.Closed:
            statusEmoji = "🔴"; // Red circle for closed
            break;
        case PullRequestStatus.Merged:
            statusEmoji = "🔵"; // Blue circle for merged
            break;
        default:
            statusEmoji = "⚪"; // White circle for unknown status
    }

    return `## Pull Request\n**Title:** [${pr.title}](${pr.html_url})\n**Status:** ${statusEmoji} ${pr.status}`;
}

export { formatPRMessageForDiscord };