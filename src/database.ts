import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "./logger";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(uri);
        logger.info("MongoDB connected...");
    } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        logger.info("MongoDB disconnected...");
    } catch (err) {
        logger.error((err as Error).message);
        process.exit(1);
    }
};

export { connectDB, disconnectDB };
