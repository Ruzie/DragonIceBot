import { Guild, GuildTextableChannel, PrivateChannel } from "eris";
import { env } from "process";
import EventManager from "../Manager/EventManager";
import Emojis from "../Utils/Emojis";
import Logger from "../Utils/Logger";

export default class GuildDelete extends EventManager {
    public get name(): string {
        return "guildDelete";
    }

    public get once(): boolean {
        return false;
    }

    async exec(guild: Guild): Promise<void> {
        const channel: GuildTextableChannel | PrivateChannel | unknown = this.client.getChannel(
            env.DEFAULT_CHANNEL_ID as string,
        );
        try {
            (await channel as GuildTextableChannel | PrivateChannel)
            .createMessage({ content: `${Emojis.guildJoined} I have been removed from guild name: **${guild.name}**, ID: **${guild.id}**, and all members were: **${guild.memberCount}**` });
        } catch (e: unknown) {
            Logger.error(e);
        }
    }
}
