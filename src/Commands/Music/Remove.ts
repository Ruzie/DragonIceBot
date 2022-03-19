import { CommandInteraction, Constants, InteractionDataOptionsNumber } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class RemoveCommand extends InteractionStruct {
    public get name(): string {
        return "remove";
    }

    public get description(): string {
        return "Remove a track from the queue";
    }

    public get options(): Array<unknown> {
        return [{
            name: "track_number",
            description: "Track number to remove that track from queue",
            type: Constants.ApplicationCommandOptionTypes.NUMBER,
            required: true,
        }];
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

        const trackNum = interaction.data.options![0] as InteractionDataOptionsNumber;
        if (Number(trackNum) > player?.queue?.length || Number(trackNum) < 1) {
            await interaction.createFollowup({ content: `${Emojis.error} Didn't found the track number. Did you wrote correct number of the track?` });
            return;
        }

        player.queue.remove(Number(trackNum) - 1, Number(trackNum));
        await interaction.createFollowup({ content: `${Emojis.ok} Removed **${Number(trackNum)}** number of track.` });
        return;
    }
}
