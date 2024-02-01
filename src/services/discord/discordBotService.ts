//discordBotService.ts
import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { getEnvVariables } from "../../config";

export const startDiscordBot = () => {
    const { DISCORD_BOT_TOKEN } = getEnvVariables()

    const client = new Client({
        intents: ["Guilds", "GuildMessages", "DirectMessages"],
    });

    client.once("ready", () => {
        console.log("Discord bot is ready! 🤖");
    });

    client.on("guildCreate", async (guild) => {
        await deployCommands({ guildId: guild.id });
    });

    //deployCommands({ guildId: "1201703058216857651" }); // This is the guild ID for the development server

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }
        const { commandName } = interaction;
        if (commands[commandName as keyof typeof commands]) {
            commands[commandName as keyof typeof commands].execute(interaction);
        }
    });

    client.login(DISCORD_BOT_TOKEN);
}
