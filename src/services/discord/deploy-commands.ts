import { REST, Routes } from "discord.js";
import { commands } from "./commands";
import { getEnvVariables } from "../../config";
import { logger } from "../../logger";

const { DISCORD_CLIENT_ID, DISCORD_BOT_TOKEN } = getEnvVariables();

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, guildId), {
            body: commandsData,
        });
    } catch (error) {
        logger.error(error);
    }
}
