import { type Client, Discord, Once } from 'discordx';
import { updateStatus } from '../utils/Util.js';

/**
 * Discord.js GuildMemberRemove event handler.
 */
@Discord()
export class GuildMemberRemove {
    /**
     * Executes when the GuildMemberRemove event is emitted.
     * @param client - The Discord client.
     * @returns void
     */
    @Once({ event: 'guildMemberRemove' })
    onGuildMemberRemove(client: Client) {
        // Set activity
        updateStatus(client);
    }
}
