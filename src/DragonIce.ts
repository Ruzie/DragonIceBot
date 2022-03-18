import { Client } from "eris";
import { config } from "dotenv";
import { resolve } from "path";
import { env } from "process";
import EventManager from "./Manager/EventManager";

config({ path: resolve(".", ".env") });

class DragonIceClient extends Client {
    public events: Promise<EventManager>;

    public constructor() {
        super(env.TOKEN as string);
        this.events = new EventManager(this).build();
        this.connectToDiscord();
    }

    private connectToDiscord(): void {
        super.connect()
        .catch((e: unknown) => console.log(e));
    }
}

export default new DragonIceClient();
