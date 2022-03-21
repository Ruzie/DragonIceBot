import { CommandInteraction, User, EmbedOptions } from "eris";
import humanizeDuration from "humanize-duration";
import { CoffeeTrack, Utils } from "lavacoffee";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";
import RichEmbed from "../../Utils/RichEmbed";
import createProgressBar from "../../Utils/Bar";

export default class NowPlayingCommand extends InteractionStruct {
    public get name(): string {
        return "nowplaying";
    }

    public get description(): string {
        return "Shows what's now playing";
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

        const track = player.queue.current as CoffeeTrack;
        const [bar, percentage] = createProgressBar(
            track.isStream ? 1 : track.duration,
            track.isStream ? 1 : player.absolutePosition,
        );
        const embed = new RichEmbed()
        .setColor(Emojis.color)
       .setDescription(`${track.title}`)
        .addFields({
            name: "Author",
            value: track.author,
            inline: true,
        }, {
            name: "Requested By",
            value: `${(track.requester as User).username}${(track.requester as User).discriminator}`,
            inline: true,
        }, {
            name: "Duration",
            value: track.isStream
            ? "Stream"
            : humanizeDuration(track.duration, { maxDecimalPoints: 0 }),
            inline: true,
        }, {
            name: "Loop",
            // eslint-disable-next-line no-nested-ternary
            value: player.loop === Utils.LoopMode.None
            ? "None"
            : player.loop === Utils.LoopMode.Track
            ? "Track"
            : "Queue",
            inline: true,
        }, {
            name: "Volume",
            value: `${player.options.volume}%`,
            inline: true,
        }, {
            name: "Paused",
            value: player.state ? "Yes" : "No",
            inline: true,
        }, {
            name: "Progress",
            value: `${bar}\n`
            + `${track.isStream
                ? "Stream"
                : `${humanizeDuration(player.absolutePosition, { maxDecimalPoints: 0 })} (${percentage.toFixed(2)}%)`}`,
        });
        await interaction.createFollowup({ embeds: [embed as EmbedOptions] });
        return;
    }
}
