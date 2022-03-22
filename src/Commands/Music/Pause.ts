import { CommandInteraction } from "eris";
import { Utils } from "lavacoffee";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class PauseCommand extends InteractionStruct {
    public get name(): string {
        return "pause";
    }

    public get description(): string {
        return "Pause the current playback";
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

        if (player.state === Utils.PlayerStates.Paused) {
            await interaction.createFollowup({ content: `${Emojis.error} Music is already paused in this server.` });
            return;
        }

        player.pause(true);
        await interaction.createFollowup({ content: `${Emojis.ok} Music has been paused, to resume use \`resume\`.` });
        return;
    }
}
