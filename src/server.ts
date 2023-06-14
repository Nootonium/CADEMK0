import { createApp } from './app';
import { Server } from "http";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "./database";

let server: Server | null = null;

export const startServer = async (port: number): Promise<Server> => {
    dotenv.config();
    const app = createApp();
    await connectDB();
    server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    return server;
};

export const stopServer = async (): Promise<void> => {
    if (server) {
        server.close();
        server = null;
    }
    await disconnectDB();
};

const port = 3000;
startServer(port);
