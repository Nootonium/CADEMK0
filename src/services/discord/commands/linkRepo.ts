import {
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
} from "discord.js";
import { repoChannelRepository } from "../../repositories/RepoChannelRepository";
import githubService from "../../github/githubService";

export const data = new SlashCommandBuilder()
    .setName("linkrepo")
    .setDescription("Links a GitHub repository to this channel.")
    .addStringOption((option) =>
        option
            .setName("repository")
            .setDescription("The URL of the GitHub repository")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const options = interaction.options as CommandInteractionOptionResolver;
    const fullRepoUrl = options.getString("repository");

    if (!fullRepoUrl) {
        return interaction.reply("Please provide a GitHub repository URL.");
    }

    const repoId = fullRepoUrl.replace("https://github.com/", "");

    const repoExists = await githubService.checkRepoExists(repoId);
    if (!repoExists) {
        return interaction.reply(
            "The GitHub repository does not exist or could not be accessed."
        );
    }

    const channelId = interaction.channelId;
    repoChannelRepository.setMapping({ repoId, channelId });

    return interaction.reply(`Linked repository ${fullRepoUrl} to this channel.`);
}
