import { sendMessageToChannel } from "./messaging";
import { logger } from "../../logger";
import { NotificationChannelModel } from "../../models/NotificationChannel";

function formatDiscordMessage(eventType: string, data: any): string {
    if (eventType === "messageSaved") {
        return (
            `**New Contact Form Submission**\n\n` +
            `**Name:** ${data.name}\n` +
            `**Email:** ${data.email}\n` +
            `**Message:**\n${data.message}`
        );
    } else if (eventType === "sessionCreated") {
        return (
            `**New Session Created**\n\n` +
            `**Session ID:** ${data.sessionId}\n` +
            `**Referral Source:** ${data.referralSource}\n` +
            `**User Agent:** ${data.userAgent}`
        );
    } else {
        return `**Unknown Event:** ${eventType}\n\nData: ${JSON.stringify(data)}`;
    }
}

export async function sendNotificationToDiscord(eventType: string, data: any) {
    try {
        const notificationChannel = await NotificationChannelModel.findOne().exec();
        if (!notificationChannel) {
            logger.error("No Discord notification channel found in the database.");
            return;
        }

        const channelId = notificationChannel.channelId;
        const formattedMessage = formatDiscordMessage(eventType, data);
        const messageId = await sendMessageToChannel(channelId, formattedMessage);

        return messageId;
    } catch (error) {
        logger.error(`Error sending Discord notification: ${error}`);
    }
}
