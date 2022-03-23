import { CommandInteraction, EmbedOptions, VERSION } from "eris";
import { memoryUsage, version } from "process";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";
import RichEmbed from "../../Utils/RichEmbed";

export default class AboutCommand extends InteractionStruct {
    public get name(): string {
        return "about";
    }

    public get description(): string {
        return "Know some info about me";
    }

   async run({ interaction }: {
       interaction: CommandInteraction
   }): Promise<void> {
       await interaction.defer();
       const embed = new RichEmbed()
       .setColor(Emojis.color)
       .setDescription(`
\n ${Emojis.about} **__${this.client.user.username} stats__**\`\`\`apache
• Servers: ${this.client.guilds.size}
• IdlePlayers: ${this.client.coffee.players.size}
• RSS: ${(memoryUsage().rss / 1000 / 1000).toFixed(2)} MiB
• HeapTotal: ${(memoryUsage().heapTotal / 1000 / 1000).toFixed(2)} MiB
• HeapUsed: ${(memoryUsage().heapUsed / 1000 / 1000).toFixed(2)} MiB
• External: ${(memoryUsage().external / 1000 / 1000).toFixed(2)} MiB
• ArrayBuffers: ${(memoryUsage().arrayBuffers / 1000 / 1000).toFixed(2)} MiB
• BotVersion: v2.0-beta
• Library: Eris v${VERSION}
• Framework: Custom
• Node.js: ${version}
• Author: riuio#9614 (ID: 757925432934006807)\`\`\`
`);
       await interaction.createFollowup({ embeds: [embed as EmbedOptions] });
    }
}
