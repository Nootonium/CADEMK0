import express, { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/githubWebhookHelper";
import { mapWebhookToPullRequest } from "../services/github/pullRequest/mapWebhookToPullRequest";
import processPullRequestUpdate from "../services/github/pullRequest/pullRequestHandler";

const router = express.Router();

router.post("/webhook/github", (req: Request, res: Response) => {
    // Verify the request is from GitHub
    const signature = req.headers["x-hub-signature"] as string;
    if (!verifyGitHubWebhookSignature(req.body, signature)) {
        return res.status(401).send("Invalid signature");
    }

    // Check if it's a Pull Request event
    if (req.body.action && req.body.pull_request) {
        const pull_request = mapWebhookToPullRequest(req.body);
        processPullRequestUpdate(pull_request);
    }

    res.status(200).send("Event received");
});

export default router;
