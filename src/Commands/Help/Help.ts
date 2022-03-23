import { CommandInteraction, EmbedOptions } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";
import RichEmbed from "../../Utils/RichEmbed";

export default class HelpCommand extends InteractionStruct {
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
       .setDescription(`Hi! I'm ${this.client.user.username}, here is my all commands list. To start with type \`/play [track_name]\`, it mainly supports YouTube, SoundCloud and radio streams.`)
       .addField(`${Emojis.musicHelp} Music`, "`nowplaying`, `pause`, `play`, `queue`, `remove`, `replay`, `resume`, `seek`, `skip`, `skipto`, `stop`, `volume`")
       .addField(`${Emojis.perform} Others`, "`about`, `ping`, `help`")
       .addFields({
           name: `${Emojis.support} Support`,
           value: "[Discord Server](https://discord.gg/CX9amVGee7)",
           inline: true,
        }, {
           name: `${Emojis.invite} Invite`,
           value: `[Invite](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=277062437952&scope=bot%20applications.commands)`,
           inline: true,
        }, {
           name: `${Emojis.vote} Vote`,
           value: `[Vote](https://top.gg/bot/${this.client.user.id}/vote)`,
           inline: true,
        })
        .setFooter("Copyright ©️ 2022 riuio. Open source under GPL Version-3.0 License.")
        .setColor(Emojis.color);
        interaction.createFollowup({ content: "Support Server: https://discord.gg/CX9amVGee7", embeds: [embed as EmbedOptions] });
    }
}
