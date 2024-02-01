import express, { Request, Response } from "express";
import { verifyGitHubWebhookSignature } from "../utils/githubWebhookHelper";

const router = express.Router();

// Endpoint for GitHub Webhook events
router.post("/webhook/github", (req: Request, res: Response) => {
    // Verify the request is from GitHub
    const signature = req.headers['x-hub-signature'] as string;
    if (!verifyGitHubWebhookSignature(req.body, signature)) {
        return res.status(401).send('Invalid signature');
    }

    // Check if it's a Pull Request event
    if (req.body.action && req.body.pull_request) {
        console.log("Received a PR Event:", req.body.action);

        // Process the PR event
        // TODO: Add your logic to handle different PR actions (opened, closed, etc.)
    }

    res.status(200).send('Event received');
});

export default router;

