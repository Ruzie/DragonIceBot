import { env } from "process";
import EventManager from "../Manager/EventManager";
import Logger from "../Utils/Logger";

export default class Debug extends EventManager {
    public get name(): string {
        return "debug";
    }

    public get once(): boolean {
        return false;
    }

    async exec(data: unknown): Promise<void> {
        if (env.DEV === "yes") {
            Logger.debug(data);
        }
    }
}
