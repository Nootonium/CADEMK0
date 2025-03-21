import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import messagesRoutes from "./routes/messageRoutes";
import githubWebhookRoutes from "./routes/githubWebhookRoutes";
import trackingRoutes from "./routes/trackingRoutes";
import { getEnvVariables } from "./config";
import { setupEventListeners } from "./events";

function createApp() {
    const { ALLOWED_ORIGIN } = getEnvVariables();
    const app = express();
    const limiter = rateLimit({
        windowMs: 24 * 60 * 60 * 1000,
        max: 100,
    });

    app.use(limiter);
    app.use(helmet());
    app.use(
        cors({
            origin: ALLOWED_ORIGIN,
        })
    );

    app.use(express.json());
    app.use(messagesRoutes);
    app.use(githubWebhookRoutes);
    app.use(trackingRoutes);

    setupEventListeners();

    app.get("/health", (_req, res) => {
        res.status(200).send({ status: "UP" });
    });

    return app;
}

export { createApp };
