import { CommandInteraction, GuildTextableChannel, Message } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class StopCommand extends InteractionStruct {
    public get name(): string {
        return "stop";
    }

    public get description(): string {
        return "Stop the current playback and leave voice channel";
    }

    async run({ interaction }: {
        interaction: CommandInteraction,
    }): Promise<void> {
        await interaction.defer();
        if (!interaction.member?.voiceState?.channelID) {
            await interaction.createFollowup({ content: `${Emojis.error} You need to be in a voice channel before running this command again.` });
            return;
        }

        const restMember = await this.client.getRESTGuildMember(
            interaction.guildID!,
            this.client.user.id,
            );
        if (restMember.voiceState.channelID) {
            if (restMember.voiceState.channelID !== interaction.member.voiceState.channelID) {
                await interaction.createFollowup({ content: `${Emojis.error} You need to connect in <#${restMember.voiceState.channelID}> voice channel to use this command.` });
                return;
            }
        }

        const player = this.client.coffee.get(interaction.guildID!);
        if (!player || !player.queue.current) {
            await interaction.createFollowup({ content: `${Emojis.error} No music is playing on this server` });
            return;
        }
        const msg: Message<GuildTextableChannel> | undefined = player?.get("msg");
        player?.set("msg", null);
        player?.destroy();
        try {
            await msg?.delete();
        // eslint-disable-next-line no-empty
        } catch { }
        await interaction.createFollowup({ content: `${Emojis.ok} Stopped current track, and leaving voice channel...` });
        return;
    }
}
