import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

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
            origin: process.env.ALLOWED_ORIGIN,
        })
    );

    app.use(express.json());
    app.use(contactRoutes);
    return app;
}
export { createApp };