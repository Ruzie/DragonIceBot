import { readdirSync } from "fs";
import { Client, UnknownInteraction, CommandInteraction, VoiceChannel } from "eris";
import { EventEmitter } from "events";
import { resolve } from "path";
import { env } from "process";
import ExtraCollection from "../Utils/Collection";
import Logger from "../Utils/Logger";
import Emojis from "../Utils/Emojis";

export default class InteractionManager extends EventEmitter {
    public client: Client;

    public commands: ExtraCollection;

    public built: boolean;

    static exec: Function;

    public constructor(client: Client) {
        super();
        this.client = client;
        this.commands = new ExtraCollection();
        this.built = false;
        this.on("error", (error: unknown) => console.log(error));
        this.client.on("interactionCreate", (interaction: CommandInteraction) => this.exec(interaction));
    }

    public async build(): Promise<this> {
        if (this.built) {
            return this;
        }
        const directories = readdirSync(resolve("dist", "Commands"), { withFileTypes: true });
        for (const directory of directories) {
            if (!directory.isDirectory()) {
                return this;
            }
            const commands = readdirSync(resolve("dist", "Commands", `${directory.name}`), { withFileTypes: true });
            for (const command of commands) {
                if (!command.isFile()) {
                    return this;
                }
                // eslint-disable-next-line import/no-dynamic-require
                const Interaction = require(resolve("dist", "Commands", `${directory.name}`, `${command.name}`)).default;
                const Command = new Interaction(this.client);
                Command.category = directory.name.charAt(0).toUpperCase()
                + directory.name.substring(1);
                this.commands.set(Command.name, Command);
                Logger.preload(`${this.constructor.name} Command '${Command.name}' loaded (@${Command.name})`);
            }
        }
        Logger.preload(`${this.constructor.name}: Total ${this.commands.size} interaction client command(s)`);
        this.built = true;
        return this;
    }

    public register(guildID?: string): void {
        const commands = this.commands.map((cmd: {
            interactionData: {
                name: string,
                description: string,
                options: unknown,
            };
        }) => cmd.interactionData);

        if (env.DEV === "yes") {
            if (guildID) {
                this.client.bulkEditGuildCommands(guildID, commands);
                Logger.success(`${this.constructor.name}: Registered ${commands.length} guild commands.`);
            }
        } else {
            this.client.bulkEditCommands(commands);
            Logger.success(`${this.constructor.name}: Registering ${commands.length} global commands, it may take up to 1 hour to sync and visible in all guilds.`);
        }
    }

    public async exec(interaction: CommandInteraction) {
        if (interaction.member?.voiceState?.channelID) {
            if (!(this.client.getChannel(interaction.member?.voiceState.channelID!) as VoiceChannel).permissionsOf(this.client.user.id).has("voiceConnect")) {
                await interaction.createMessage({ content: `${Emojis.error} I have no permission to join in your voice channel. Required Permission: \`Connect\`` })
                .catch(() => { });
                return;
            }
            if (!(this.client.getChannel(interaction.member?.voiceState.channelID!) as VoiceChannel).permissionsOf(this.client.user.id).has("voiceSpeak")) {
                await interaction.createMessage({ content: `${Emojis.error} I have no permission to speak in your voice channel. Required Permission: \`Speak\`` })
                .catch(() => { });
                return;
            }
        }
        let failedCmd;
        try {
            const command = this.commands.get(interaction.data.name);
            failedCmd = command.name;
            Logger.success(`${this.constructor.name}: Executing command ${command.name}`);
            await command.run({ interaction });
        } catch (error: unknown) {
            if (error instanceof UnknownInteraction) {
                Logger.error(`Interaction failed when executing: ${failedCmd}`);
            }
            Logger.error(error);
        }
    }
}
