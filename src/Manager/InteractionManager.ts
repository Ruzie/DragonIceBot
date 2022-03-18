import { readdirSync } from "fs";
import { Client } from "eris";
import { EventEmitter } from "events";
import { resolve } from "path";
import ExtraCollection from "../Utils/Collection";
import Logger from "../Utils/Logger";

export default class SlashManager extends EventEmitter {
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
        this.client.on("interactionCreate", (interaction) => this.exec(interaction));
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
        Logger.preload(`${this.constructor.name}: Loaded ${this.commands.size} interaction client command(s)`);
        this.built = true;
        return this;
    }

    public register(guildID?: string): void {
        const commands = this.commands.map((cmd: any) => cmd.interactionData);
        console.log(commands);
        if (guildID) {
            this.client.bulkEditGuildCommands(guildID, commands);
            Logger.success(`${this.constructor.name}: Registered guild commands.`);
        } else {
            this.client.bulkEditCommands(commands);
            Logger.success(`${this.constructor.name}: Registered global commands.`);
        }
    }

    public async exec(interaction: any) {
        try {
            const command = this.commands.get(interaction.data.name);
            Logger.success(`${this.constructor.name}: Executing command ${command.name} (@${command.uid})`);
            await command.run({ interaction });
        } catch (error) {
            Logger.error(error);
        }
    }
}
