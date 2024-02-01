import mongoose from "mongoose";
import { logger } from "./logger";

const connectDB = async (MONGODB_URI: string) => {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(MONGODB_URI);
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
