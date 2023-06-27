import dotenv from "dotenv";
dotenv.config();

import { Server } from "http";
import { createApp } from "./app";
import { connectDB, disconnectDB } from "./database";

let server: Server | null = null;

export const startServer = async (port: number): Promise<Server> => {
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
