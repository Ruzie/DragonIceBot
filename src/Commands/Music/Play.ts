import { CommandInteraction, Constants, InteractionDataOptionsString } from "eris";
import { Utils } from "lavacoffee";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class PlayCommand extends InteractionStruct {
    public get name(): string {
        return "play";
    }

    public get description(): string {
        return "Play a track which you want to";
    }

    public get options(): Array<unknown> {
        return [{
            name: "track",
            description: "Name of the track which you want to play",
            type: Constants.ApplicationCommandOptionTypes.STRING,
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

        const arg = await interaction.data.options![0] as InteractionDataOptionsString;
        const player = this.client.coffee.create({
            guildID: interaction.guildID!,
            voiceID: interaction.member?.voiceState?.channelID,
            volume: 100,
            selfDeaf: true,
            metadata: {
              text: interaction.channel,
              voice: interaction.member?.voiceState,
            },
        });

        if (player.voiceState !== Utils.PlayerVoiceStates.Connected) {
            player.connect();
        }

        const msg = await interaction.createFollowup({ content: `${Emojis.loading} Loading **${arg?.value}**` });
        const res = await this.client.coffee.search({
            query: arg?.value,
        }, interaction.member);

        switch (res.loadType) {
            case Utils.LoadTypes.LoadFailed:
                await msg.edit({ content: `${Emojis.error} Failed to load the ${res.tracks.length > 1 ? "playlist" : "track"}` })
                .catch(() => { });

                if (!player.queue.current) {
                    player.destroy();
                }
            break;

            case Utils.LoadTypes.NoMatches:
                await msg.edit({ content: `${Emojis.error} No track(s) found about your query. Did you write it correctly?` })
                .catch(() => { });
            break;

            case Utils.LoadTypes.TrackLoaded:
                player.queue.add(res.tracks[0]);
                await msg.edit({ content: `${Emojis.added} Added **${res.tracks[0].title}** to the queue` })
                .catch(() => { });

                if (!player.queue.current) {
                    await player.play();
                }
            break;

            case Utils.LoadTypes.PlaylistLoaded:
                player.queue.add(res.tracks);
                await msg.edit({ content: `${Emojis.added} Added **${res.tracks.length}** tracks to the queue` })
                .catch(() => { });

                if (!player.queue.current) {
                    await player.play();
                }
            break;

            case Utils.LoadTypes.SearchResult:
                player.queue.add(res.tracks[0]);
                await msg.edit({ content: `${Emojis.added} Added **${res.tracks[0].title}** to the queue` })
                .catch(() => { });

                if (!player.queue.current) {
                    await player.play();
                }
            break;

            default:
                await msg.edit({ content: `${Emojis.error} Unknown payload op found.` })
                .catch(() => { });

                if (!player.queue.current) {
                    player.destroy();
                }
            break;
        }
    }
}
