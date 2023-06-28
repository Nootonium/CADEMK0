import { getEnvVariables } from "./config";
import { Server } from "http";
import { createApp } from "./app";
import { connectDB, disconnectDB } from "./database";

let server: Server | null = null;

export const startServer = async (): Promise<Server> => {
    const { MONGODB_URI, PORT} = getEnvVariables();
    await connectDB(MONGODB_URI);
    const app = createApp();
    server = app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
        console.log('ALLOWED ORIGINS: ', process.env.ALLOWED_ORIGIN)
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

startServer();
