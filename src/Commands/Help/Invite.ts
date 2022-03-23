import { CommandInteraction } from "eris";
import InteractionStruct from "../../Struct/InteractionStruct";
import Emojis from "../../Utils/Emojis";

export default class InviteCommand extends InteractionStruct {
    public get name(): string {
        return "invite";
    }

    public get description(): string {
        return "Invite the bot to your server";
    }

   async run({ interaction }: {
       interaction: CommandInteraction
   }): Promise<void> {
       await interaction.defer();
       await interaction.createFollowup(
           { content: `Invite me: https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=277062437952&scope=bot%20applications.commands\nDiscord Server: https://discord.gg/CX9amVGee7` },
        );
    }
}
