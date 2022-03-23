import { Client } from "eris";
import { config } from "dotenv";
import { resolve } from "path";
import { env } from "process";
import type { CoffeeLava } from "lavacoffee";
import Logger from "./Utils/Logger";
import EventManager from "./Manager/EventManager";
import "./Utils/Errors";

config({ path: resolve(".", ".env") });

class DragonIceClient extends Client {
    public events: Promise<EventManager>;

    public constructor() {
        super(env.TOKEN as string, {
            intents: ["guilds", "guildVoiceStates"],
            restMode: true,
        });
        this.events = new EventManager(this).build();
        this.connectToDiscord();
    }

    private connectToDiscord(): void {
        super.connect()
        .catch((e: unknown) => Logger.error(e));
    }
}

declare module "eris" {
    export interface Client {
        coffee: CoffeeLava
    }
}

export default new DragonIceClient();
