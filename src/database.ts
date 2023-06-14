import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(uri);
        console.log("MongoDB connected...");
    } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected...");
    } catch (err) {
        console.error((err as Error).message);
        process.exit(1);
    }
};

export { connectDB, disconnectDB };
