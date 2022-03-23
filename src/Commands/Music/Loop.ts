import { CommandInteraction, Constants, InteractionDataOptionsString } from "eris";
import { Utils } from "lavacoffee";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class LoopCommand extends InteractionStruct {
    public get name(): string {
        return "loop";
    }

    public get description(): string {
        return "Loop the current track or the queue";
    }

    public get options(): Array<unknown> {
        return [{
            name: "mode",
            description: "Set a loop mode",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true,
            choices: [{
                name: "none",
                value: "none",
            }, {
                name: "queue",
                value: "queue",
            }, {
                name: "track",
                value: "track",
            }],
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

        const mode = (interaction.data.options![0] as InteractionDataOptionsString).value;
        // eslint-disable-next-line no-nested-ternary
        player.setLoop(mode === "none"
        ? Utils.LoopMode.None : mode === "track"
        ? Utils.LoopMode.Track : Utils.LoopMode.Queue);
        await interaction.createFollowup({ content: `${Emojis.ok} Loop mode set to as ${mode}` });
        return;
    }
}
