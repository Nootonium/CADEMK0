import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { NotificationChannelModel } from "../../../models/notificationChannel";
import { logger } from "../../../logger";

export const data = new SlashCommandBuilder()
    .setName("linknotif")
    .setDescription("Set the portfolio notification channel.");

export async function execute(interaction: CommandInteraction) {
    const channelId = interaction.channelId;
    try {
        await NotificationChannelModel.create({ channelId });
        return interaction.reply(
            `Portfolio notification channel set to <#${channelId}>.`
        );
    } catch (error) {
        logger.error("Error setting portfolio notification channel:", error);
        return interaction.reply(
            "An error occurred while setting the portfolio notification channel."
        );
    }
}
