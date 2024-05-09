import { EventEmitter } from "events";
import { sendNotificationToDiscord } from "./services/discord/notification";

export const eventEmitter = new EventEmitter();

export function setupEventListeners() {
    eventEmitter.on("messageSaved", async (message) => {
        try {
            await sendNotificationToDiscord(message);
        } catch (error) {
            console.error("Failed to send notification:", error);
        }
    });
}
