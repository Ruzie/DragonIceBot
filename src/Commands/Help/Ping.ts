import { CommandInteraction } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class PingCommand extends InteractionStruct {
    public get name(): string {
        return "ping";
    }

    public get description(): string {
        return "Shows ping pong";
    }

   async run({ interaction }: {
       interaction: CommandInteraction
   }): Promise<void> {
       await interaction.defer();
       const pre = Date.now();
       const msg = await interaction.createFollowup({ content: "Checking ping..." });
       const now = Date.now();
       const diff = now - pre;
       await msg.edit(`${Emojis.noice} Done! Interaction edit ping: ${diff}, latency: ${this.client.shards.map((x) => x.latency)}`)
       .catch(() => { });
    }
}
