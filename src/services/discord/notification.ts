import { sendMessageToChannel } from "./messaging";
import { logger } from "../../logger";
import { NotificationChannelModel } from "../../models/notificationChannel";

function formatMessageForDiscord({
    name,
    email,
    message,
}: {
    name: string;
    email: string;
    message: string;
}): string {
    const formattedMessage =
        `**New Contact Form Submission**\n\n` +
        `**Name:** ${name}\n` +
        `**Email:** ${email}\n` +
        `**Message:**\n${message}`;
    return formattedMessage;
}

export async function sendNotificationToDiscord(message: {
    name: string;
    email: string;
    message: string;
}) {
    const formattedMessage = formatMessageForDiscord(message);
    try {
        const notificationChannel = await NotificationChannelModel.findOne().exec();
        if (!notificationChannel) {
            logger.error("No notification channel found in the database.");
            return;
        }
        const channelId = notificationChannel.channelId;
        const messageId = await sendMessageToChannel(channelId, formattedMessage);
        return messageId;
    } catch (error) {
        logger.error(`Database or messaging error: ${error}`);
    }
}
