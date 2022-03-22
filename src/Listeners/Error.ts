import EventManager from "../Manager/EventManager";
import Logger from "../Utils/Logger";

export default class Error extends EventManager {
    public get name(): string {
        return "error";
    }

    public get once(): boolean {
        return false;
    }

    async exec(data: unknown, id: string): Promise<void> {
        Logger.error(`Shard ${id} encountered with an error: ${data}`);
    }
}
