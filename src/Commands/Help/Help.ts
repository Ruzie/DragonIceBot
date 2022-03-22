import { CommandInteraction, EmbedOptions } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";
import RichEmbed from "../../Utils/RichEmbed";

export default class Ping extends InteractionStruct {
    public get name(): string {
        return "help";
    }

    public get description(): string {
        return "Shows help information";
    }

   async run({ interaction }: {
       interaction: CommandInteraction
   }): Promise<void> {
       await interaction.defer();
       const embed: RichEmbed = new RichEmbed()
       .setTitle(`${Emojis.question} Help`)
       .setDescription(
`${this.client.user.username} is a free and open source Discord music bot.
To start with type \`/play [track_name]\`, it mainly supports YouTube, SoundCloud and radio streams.
Source code: [${this.client.user.username}](https://github.com/Ruzie/DragonIceBot)`,
)
       .addField(`${Emojis.musicHelp} Music`, "`nowplaying`, `pause`, `play`, `queue`, `remove`, `replay`, `resume`, `seek`, `skip`, `skipto`, `stop`, `volume`")
       .setColor(0x122CC);
       interaction.createFollowup({ embeds: [embed as EmbedOptions] });
    }
}
