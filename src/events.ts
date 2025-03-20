import { EventEmitter } from "events";
import { sendNotificationToDiscord } from "./services/discord/notification";

export const eventEmitter = new EventEmitter();

export function setupEventListeners() {
    eventEmitter.on("messageSaved", async (message) => {
        try {
            await sendNotificationToDiscord("messageSaved", message);
        } catch (error) {
            console.error("Failed to send notification:", error);
        }
    });

    eventEmitter.on("sessionCreated", async (session) => {
        try {
            await sendNotificationToDiscord("sessionCreated", session);
        } catch (error) {
            console.error("Failed to process sessionCreated event:", error);
        }
    });
}
