import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { logger } from "./logger";

function createApp() {
    const app = express();
    const limiter = rateLimit({
        windowMs: 24 * 60 * 60 * 1000,
        max: 10,
    });

    app.use(limiter);
    app.use(helmet());
    
    app.use(
        cors({
            origin: process.env.ALLOWED_ORIGIN
        })
    );

    app.use(express.json());
    app.use(contactRoutes);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err.stack);
        res.status(500).send("Something broke!");
    });
    return app;
}
export { createApp };
