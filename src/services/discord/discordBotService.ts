//discordBotService.ts
import { Client, GatewayIntentBits } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { getEnvVariables } from "../../config";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
});

let botReady = false;

export const startDiscordBot = async (): Promise<void> => {
    const { DISCORD_BOT_TOKEN } = getEnvVariables();

    client.once("ready", () => {
        console.log("Discord bot is ready! 🤖");
        botReady = true;
    });

    client.on("guildCreate", async (guild) => {
        await deployCommands({ guildId: guild.id });
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }
        const { commandName } = interaction;
        if (commands[commandName as keyof typeof commands]) {
            commands[commandName as keyof typeof commands].execute(interaction);
        }
    });

    await client.login(DISCORD_BOT_TOKEN);
};

export const isBotReady = (): boolean => botReady;

export { client };
