import { GuildTextableChannel, Message, VoiceChannel } from "eris";
import EventManager from "../Manager/EventManager";
import Emojis from "../Utils/Emojis";

export default class VoiceStateUpdate extends EventManager {
    public get name(): string {
        return "voiceStateUpdate";
    }

    public get once(): boolean {
        return false;
    }

    async exec(oldChannel: VoiceChannel, newChannel: VoiceChannel) {
        if (!newChannel || newChannel === undefined) {
            const player = this.client.coffee.get(oldChannel?.guild?.id ?? null);
            const msg: Message<GuildTextableChannel> | undefined = player?.get("msg");
            await msg?.delete()
            .catch(() => { });
        }
        setTimeout(async () => {
            if (oldChannel.guild.voiceStates.size === 1) {
                const player = this.client.coffee.get(oldChannel?.guild?.id ?? null);
                try {
                    const channel: GuildTextableChannel | undefined = player?.get("text");
                    player?.destroy();
                    await channel?.createMessage({ content: `${Emojis.timeOver} Left the voice channel as there are no more users...` });
                    // @ts-ignore: Checked and deleted shouldn't be optional
                    delete this.client.coffee.get(oldChannel.guild.id);
                    // eslint-disable-next-line no-empty
                } catch { }
            }
        }, 5000);
    }
}
