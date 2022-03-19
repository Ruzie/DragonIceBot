import { CommandInteraction, Constants, InteractionDataOptionsNumber } from "eris";
import ms from "ms";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class SeekCommand extends InteractionStruct {
    public get name(): string {
        return "seek";
    }

    public get description(): string {
        return "Seek the track to a specific time";
    }

    public get options(): Array<unknown> {
        return [{
            name: "time",
            description: "How much time to seek the track",
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

        const pos = ms((interaction.data.options![0] as InteractionDataOptionsNumber).value);

        if (Number(pos) < 0 || Number(pos) > player.queue.current.duration!) {
            await interaction.createFollowup({ content: `${Emojis.error} Seeking time must be bigger than **0** and lower than **${player.queue.current.duration}**.` });
            return;
        }
        if (typeof pos === "undefined") {
            await interaction.createFollowup({ content: `${Emojis.error} Invalid time format, can't parse.` });
            return;
        }
        player.seek(Number(pos));
        await interaction.createFollowup({ content: `${Emojis.ok} Seeked **${ms(Number(pos), { long: true })}**` });
        return;
    }
}
