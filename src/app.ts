// app.ts
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import messagesRoutes from "./routes/messageRoutes";
import githubWebhookRoutes from "./routes/githubWebhookRoutes"; 
import { getEnvVariables } from "./config";

function createApp() {
    const { ALLOWED_ORIGIN } = getEnvVariables();
    const app = express();
    const limiter = rateLimit({
        windowMs: 24 * 60 * 60 * 1000,
        max: 100,
    });
    app.use((req, res, next) => {
        console.log("Request Origin:", req.get("origin"));
        next();
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

    return app;
}

export { createApp };
