// app.ts
import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import messagesRoutes from "./routes/messageRoutes";
import githubWebhookRoutes from "./routes/githubWebhookRoutes";
import { getEnvVariables } from "./config";
import { setupEventListeners } from "./events";

const delayMiddleware =
    (delayInMs: number) => (_req: Request, _res: Response, next: NextFunction) => {
        setTimeout(() => next(), delayInMs);
    };

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
    app.use(delayMiddleware(1000));

    app.use(express.json());
    app.use(messagesRoutes);
    app.use(githubWebhookRoutes);

    setupEventListeners();

    app.get('/health', (_req, res) => {
        res.status(200).send({ status: 'UP' });
    });

    return app;
}

export { createApp };
