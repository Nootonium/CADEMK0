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
    description: string;
    author: string;
    labels: string[];
    constructor(
        id: string,
        title: string,
        repoId: string,
        stringStatus: string,
        html_url: string,
        author: string,
        labels: string[],
        description: string
    ) {
        this.id = id;
        this.title = title;
        this.repoId = repoId;
        this.status = stringStatus as PullRequestStatus;
        this.html_url = html_url;
        this.author = author;
        this.labels = labels;
        this.description = description;
    }
}

export { PullRequest, PullRequestStatus };
