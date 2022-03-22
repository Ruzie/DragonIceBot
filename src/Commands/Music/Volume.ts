import { CommandInteraction, Constants, GuildTextableChannel, InteractionDataOptionsNumber, Message } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class VolumeCommand extends InteractionStruct {
    public get name(): string {
        return "volume";
    }

    public get description(): string {
        return "Change volume of the player";
    }

    public get options(): Array<unknown> {
        return [{
            name: "level",
            description: "Volume level increase or decrease",
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
        const level = (interaction.data.options![0] as InteractionDataOptionsNumber).value;

        if (Number(level) < 0 || Number(level) > 200) {
            await interaction.createFollowup({ content: `${Emojis.error} Volume must be lower than \`200\` and higher than \`0\`.` });
            return;
        }

        player.setVolume(level);
        await interaction.createFollowup({ content: `${Emojis.ok} Volume set to **${level}**.` });
        return;
    }
}
