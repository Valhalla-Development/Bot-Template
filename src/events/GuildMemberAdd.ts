import type { Client } from 'discordx';
import { Discord, Once } from 'discordx';
import { updateStatus } from '../utils/Util.js';

/**
 * Discord.js GuildMemberAdd event handler.
 */
@Discord()
export class GuildMemberAdd {
    /**
     * Executes when the GuildMemberAdd event is emitted.
     * @param client - The Discord client.
     * @returns void
     */
    @Once({ event: 'guildMemberAdd' })
    async onGuildMemberAdd(client: Client) {
        // Set activity
        updateStatus(client);
    }
}
