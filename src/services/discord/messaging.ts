import { TextChannel } from "discord.js";
import { client } from "./discordBotService";
import { logger } from "../../logger";

async function getTextChannel(channelId: string): Promise<TextChannel | null> {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !(channel instanceof TextChannel)) {
            logger.error("The channel is not found or not a text channel.");
            return null;
        }
        return channel;
    } catch (error) {
        logger.error("Error fetching channel: " + error);
        return null;
    }
}

async function sendMessageToChannel(
    channelId: string,
    messageContent: string
): Promise<string | null> {
    const channel = await getTextChannel(channelId);
    if (!channel) return null;

    try {
        const message = await channel.send(messageContent);
        logger.info(`Message sent to ${channelId} with ID: ${message.id}`);
        return message.id;
    } catch (error) {
        logger.error("Error sending message: " + error);
        return null;
    }
}

async function updateMessageInChannel(
    channelId: string,
    messageId: string,
    newMessageContent: string
): Promise<boolean> {
    const channel = await getTextChannel(channelId);
    if (!channel) return false;
    try {
        const message = await channel.messages.fetch(messageId);
        await message.edit(newMessageContent);
        logger.info(`Message ${messageId} in ${channelId} updated successfully.`);
        return true;
    } catch (error) {
        logger.error("Error updating message: " + error);
        return false;
    }
}

export { sendMessageToChannel, updateMessageInChannel };
