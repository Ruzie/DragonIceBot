import { CommandInteraction, InteractionDataOptionsNumber } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class SkipToCommand extends InteractionStruct {
    public get name(): string {
        return "skipto";
    }

    public get description(): string {
        return "Skip to a specific track";
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
        const trackNum = (interaction.data.options![0] as InteractionDataOptionsNumber).value;
        if (!trackNum) {
            await interaction.createFollowup({ content: `${Emojis.error} You need to provide a track number to skip` });
            return;
        }
        if (Number.isNaN(trackNum)) {
            await interaction.createFollowup({ content: `${Emojis.error} Track number must be an integer` });
            return;
        }
        if (trackNum > player.queue.length) {
            await interaction.createFollowup({ content: `${Emojis.error} Can't skip more than **${player.queue.length}** tracks` });
            return;
        }
        if (trackNum < 2) {
            await interaction.createFollowup({ content: `${Emojis.error} Can't skip to the first track, for that use skip instead` });
            return;
        }
        player.queue.remove(0, trackNum - 1);
        player.stop();
        await interaction.createFollowup({ content: `${Emojis.ok} Skipped to track number **${trackNum}**` });
        return;
    }
}
