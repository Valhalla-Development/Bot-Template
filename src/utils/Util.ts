import { ActivityType, Message } from 'discord.js';
import { Client } from 'discordx';
import '@colors/colors';

/**
 * Capitalises the first letter of each word in a string.
 * @param string - The string to be capitalised.
 * @returns The capitalised string.
 */
export function capitalise(string: string): string {
    return string.replace(/\S+/g, (word) => word.slice(0, 1).toUpperCase() + word.slice(1));
}

/**
 * Checks if a message is deletable, and deletes it after a specified amount of time.
 * @param message - The message to check.
 * @param time - The amount of time to wait before deleting the message, in milliseconds.
 * @returns void
 */
export function deletableCheck(message: Message, time: number): void {
    setTimeout(async () => {
        try {
            if (message && message.deletable) {
                await message.delete();
            }
        } catch (error) {
            // Do nothing with the error
        }
    }, time);
}

/**
 * Fetches the registered global application commands and returns an object
 * containing the command names as keys and their corresponding IDs as values.
 * @param client - The Discord Client instance.
 * @returns An object containing command names and their corresponding IDs.
 * If there are no commands or an error occurs, an empty object is returned.
 */
export async function getCommandIds(client: Client): Promise<{ [name: string]: string }> {
    try {
        // Fetch the registered global application commands
        const commands = await client.application?.commands.fetch();

        if (!commands) {
            return {};
        }

        // Create an object to store the command IDs
        const commandIds: { [name: string]: string } = {};

        commands.forEach((command) => {
            commandIds[command.name] = command.id;
        });

        return commandIds;
    } catch (error) {
        console.error('Error fetching global commands:', error);
        return {};
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
 * Each character in the string is colored in a sequence of colors in the reversed rainbow order.
 *
 * @param str - The string to which the reversed rainbow effect will be applied.
 * @returns The input string with each character colored according to the reversed rainbow sequence.
 */
export function reversedRainbow(str: string): string {
    // Define color functions that apply the color to the text
    const colorFunctions = {
        red: (text: string) => text.red,
        magenta: (text: string) => text.magenta,
        blue: (text: string) => text.blue,
        green: (text: string) => text.green,
        yellow: (text: string) => text.yellow,
    };

    // Type for valid color names based on the colorFunctions object keys
    type ColorName = keyof typeof colorFunctions;

    // Array of colors to use in the reversed rainbow order
    const colors: ColorName[] = ['red', 'magenta', 'blue', 'green', 'yellow', 'red'];

    // Map each character of the string to its corresponding color and join them back into a string
    return str.split('')
        .map((char, i) => {
            // Determine the color for the current character
            const color = colors[i % colors.length];
            // Apply the color function to the character
            return colorFunctions[color](char);
        })
        .join('');
}
