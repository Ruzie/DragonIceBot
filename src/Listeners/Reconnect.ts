import EventManager from "../Manager/EventManager";
import Logger from "../Utils/Logger";

export default class Disconnect extends EventManager {
    public get name(): string {
        return "disconnect";
    }

    public get once(): boolean {
        return false;
    }

    async exec(): Promise<void> {
        Logger.preload("Reconnecting to the Discord gateway, please wait...");
    }
}
