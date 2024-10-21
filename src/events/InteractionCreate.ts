import type { ArgsOf, Client } from 'discordx';
import { Discord, On } from 'discordx';
import { ChannelType, codeBlock, EmbedBuilder } from 'discord.js';
import moment from 'moment';
import { reversedRainbow } from '../utils/Util.js';

@Discord()
export class InteractionCreate {
    /**
     * Handler for interactionCreate event.
     * @param args - An array containing the interaction and client objects.
     * @param client - The Discord client.
     */
    @On({ event: 'interactionCreate' })
    async onInteraction([interaction]: ArgsOf<'interactionCreate'>, client: Client) {
        // Check if the interaction is in a guild and in a guild text channel, and is either a string select menu or a chat input command.
        if (!interaction.guild || !interaction.channel || interaction.channel.type !== ChannelType.GuildText
            || (!interaction.isStringSelectMenu() && !interaction.isChatInputCommand() && !interaction.isContextMenuCommand())) return;

        try {
            await client.executeInteraction(interaction);
        } catch (err) {
            console.error(`Error executing interaction: ${err}`);
        }

        if (process.env.LOGGING?.toLowerCase() === 'true') {
            if (!interaction.isChatInputCommand()) return;

            const now = Date.now();
            const nowInSeconds = Math.floor(now / 1000);
            const executedCommand = interaction.toString();

            // Console logging
            console.log(
                `${'◆◆◆◆◆◆'.rainbow.bold} ${moment(now).format('MMM D, h:mm A')} ${reversedRainbow('◆◆◆◆◆◆')}\n`
                    + `${'🔧 Command:'.brightBlue.bold} ${executedCommand.brightYellow.bold}\n`
                    + `${'🔍 Executor:'.brightBlue.bold} ${interaction.user.displayName.underline.brightMagenta.bold} ${'('.gray.bold}${'Guild: '.brightBlue.bold}${interaction.guild.name.underline.brightMagenta.bold}${')'}`,
            );

            // Embed logging
            const logEmbed = new EmbedBuilder()
                .setColor('#e91e63')
                .addFields({
                    name: `Guild: ${interaction.guild.name} | Date: <t:${nowInSeconds}>`,
                    value: codeBlock('kotlin', `${interaction.user.username} executed the '${executedCommand}' command`),
                });

            // Channel logging
            const loggingChannelId = process.env.COMMAND_LOGGING;
            if (loggingChannelId) {
                const channel = client.channels.cache.get(loggingChannelId);
                if (channel?.type === ChannelType.GuildText) {
                    channel.send({ embeds: [logEmbed] }).catch(console.error);
                }
            }
        }
    }
}
