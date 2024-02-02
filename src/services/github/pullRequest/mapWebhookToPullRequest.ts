import { PullRequest } from "./pullRequest"

export function mapWebhookToPullRequest(prData : any): PullRequest {

    const newPullRequest = new PullRequest(
        prData.pull_request.id.toString(),
        prData.pull_request.title,
        prData.repository.full_name,
        prData.pull_request.state,
        prData.pull_request.html_url,
    );

    return newPullRequest;
}
