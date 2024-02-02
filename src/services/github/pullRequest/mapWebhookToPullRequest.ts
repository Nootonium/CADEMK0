import { PullRequest } from "./pullRequest";

export function mapWebhookToPullRequest(prData: any): PullRequest {
    if (prData.pull_request.state === "closed") {
        if (prData.pull_request.merged) {
            prData.pull_request.state = "merged";
        }
    }
    const newPullRequest = new PullRequest(
        prData.pull_request.id.toString(),
        prData.pull_request.title,
        prData.repository.full_name,
        prData.pull_request.state,
        prData.pull_request.html_url,
        prData.pull_request.user.login,
        prData.pull_request.labels.map((label: any) => label.name),
        prData.pull_request.body
    );
    return newPullRequest;
}
