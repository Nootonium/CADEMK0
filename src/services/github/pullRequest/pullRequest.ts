enum PullRequestStatus {
    Open = "open",
    Closed = "closed",
    Merged = "merged",
}

class PullRequest {
    id: string;
    title: string;
    repoId: string;
    status: PullRequestStatus;
    html_url: string;
    constructor(
        id: string,
        title: string,
        repoId: string,
        stringStatus: string,
        html_url: string,
    ) {
        this.id = id;
        this.title = title;
        this.repoId = repoId;
        this.status = stringStatus as PullRequestStatus;
        this.html_url = html_url;
    }
}

export { PullRequest, PullRequestStatus };
