import { REST, Routes } from "discord.js";
import { commands } from "./commands";
import { getEnvVariables } from "../../config";


const { DISCORD_CLIENT_ID, DISCORD_BOT_TOKEN } = getEnvVariables();

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        console.log("Started refreshing application (/) commands.");

        await rest.put(
            Routes.applicationGuildCommands(DISCORD_CLIENT_ID, guildId),
            {
                body: commandsData,
            }
        );

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
}
