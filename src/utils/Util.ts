import {
    ActivityType, ChannelType, codeBlock, EmbedBuilder, Message, TextChannel,
} from 'discord.js';
import { Client } from 'discordx';
import '@colors/colors';

/**
 * Capitalises the first letter of each word in a string.
 * @param str - The string to be capitalised.
 * @returns The capitalised string.
 */
export const capitalise = (str: string): string => str.replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Deletes a message after a specified delay if it's deletable.
 * @param message - The message to delete.
 * @param time - The delay before deletion, in milliseconds.
 */
export function deletableCheck(message: Message, time: number): void {
    setTimeout(() => {
        message.delete().catch((error) => console.error('Error deleting message:', error));
    }, time);
}

/**
 * Fetches all registered global application command IDs.
 * @param client - The Discord client instance.
 * @returns A Promise that resolves to a record of command names to their corresponding IDs.
 * @throws Error if unable to fetch commands or if the client's application is not available.
 */
export async function getCommandIds(client: Client): Promise<Record<string, string>> {
    if (!client.application) {
        throw new Error('Client application is not available');
    }

    try {
        const commands = await client.application.commands.fetch();
        return Object.fromEntries(commands.map((c) => [c.name, c.id]));
    } catch (error) {
        console.error('Error fetching global commands:', error);
        throw error;
    }
}

/**
 * Updates the status of the Discord client with information about guilds and users.
 * @param client - The Discord client instance.
 */
export function updateStatus(client: Client) {
    client.user?.setActivity({
        type: ActivityType.Watching,
        name: `${client.guilds.cache.size.toLocaleString('en')} Guilds
            ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString('en')} Users`,
    });
}

/**
 * Applies a reversed rainbow effect to the input string.
 * @param str - The string to apply the reversed rainbow effect.
 * @returns The input string with reversed rainbow coloring.
 */
export const reversedRainbow = (str: string): string => {
    const colors = ['red', 'magenta', 'blue', 'green', 'yellow', 'red'] as const;
    return str
        .split('')
        .map((char, i) => char[colors[i % colors.length] as keyof typeof char])
        .join('');
};

/**
 * Handles given error by logging it and optionally sending it to a Discord channel.
 * @param client - The Discord client instance
 * @param error - The unknown error
 */
export async function handleError(client: Client, error: unknown): Promise<void> {
    if (!(error instanceof Error) || !error.stack) {
        console.error('Invalid error object:', error);
        return;
    }

    console.error(error);

    if (process.env.LOGGING?.toLowerCase() !== 'true' || !process.env.LOGGING_CHANNEL) return;

    /**
     * Truncates the description if it exceeds the maximum length.
     * @param description - The description to truncate
     * @returns The truncated description
     */
    function truncateDescription(description: string): string {
        const maxLength = 4096;
        if (description.length <= maxLength) return description;

        const numTruncatedChars = description.length - maxLength;
        return `${description.slice(0, maxLength)}... ${numTruncatedChars} more`;
    }

    try {
        const channel = client.channels.cache.get(process.env.LOGGING_CHANNEL) as TextChannel | undefined;

        if (!channel || channel.type !== ChannelType.GuildText) {
            console.error(`Invalid logging channel: ${process.env.LOGGING_CHANNEL}`);
            return;
        }

        const typeOfError = error.name || 'Unknown Error';
        const fullError = error.stack;
        const timeOfError = `<t:${Math.floor(Date.now() / 1000)}>`;

        const fullString = [
            `From: \`${typeOfError}\``,
            `Time: ${timeOfError}`,
            '',
            'Error:',
            codeBlock('js', fullError),
        ].join('\n');

        const embed = new EmbedBuilder()
            .setTitle('Error')
            .setDescription(truncateDescription(fullString))
            .setColor('#FF0000');

        await channel.send({ embeds: [embed] });
    } catch (sendError) {
        console.error('Failed to send the error embed:', sendError);
    }
}
