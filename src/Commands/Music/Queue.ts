import { CommandInteraction, Constants, EmbedOptions, InteractionDataOptionsNumber } from "eris";
import humanizeDuration from "humanize-duration";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";
import RichEmbed from "../../Utils/RichEmbed";

export default class QueueCommand extends InteractionStruct {
    public get name(): string {
        return "queue";
    }

    public get description(): string {
        return "Shows the upcoming queue";
    }

    public get options(): Array<unknown> {
        return [{
            name: "page",
            description: "Select queue page",
            type: Constants.ApplicationCommandOptionTypes.NUMBER,
            required: false,
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
        let p;
        if (interaction?.data?.options) {
            p = (interaction.data.options![0] as InteractionDataOptionsNumber).value;
        } else {
            p = 1;
        }
        try {
            if (!player.queue.length) {
                await interaction.createFollowup({ content: `${Emojis.error} The queue is current;y empty.` });
                return;
            }
            const embed = new RichEmbed().setColor(Emojis.color);
            const multiple = 10;
            const page = Number(p) || 1;
            const end = page * multiple;
            const start = end - multiple;
            const tracks = player.queue.slice(start, end);
            if (player.queue.current) embed.addField(`${Emojis.nowPlaying} Now playing`, `${Emojis.queueDia} ${player.queue.current.title}`);
            if (!tracks.length) {
                await interaction.createFollowup({ content: `${Emojis.error} No tracks found in ${page > 1 ? `page ${page}.` : "the queue."}` });
                return;
            }
            embed.setDescription(
                `${Emojis.queueList} **Queue List**\n
                ${tracks.map((track, i) => `**${start + (++i)}.** ${Emojis.queueDia} ${track.title.replace("||", "")} | \`[${humanizeDuration(track.duration!, { maxDecimalPoints: 0 })}]\``)
                    .join("\n").toString()}
                `,
                );
            const maxPages = Math.ceil(player.queue.length / multiple);
            embed.addField("\n", `Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

            await interaction.createFollowup({ embeds: [embed as EmbedOptions] });
        } catch (e: unknown) {
            console.log(e);
            await interaction.createFollowup({ content: `${Emojis.error} No page number **${p}** found in the queue` });
        }
    }
}
