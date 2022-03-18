/* eslint-disable no-unused-expressions */
import { Client } from "eris";
import { readdirSync } from "fs";
import { resolve } from "path";
import Logger from "../Utils/Logger";

export default class EventManager {
    public client: Client;

    public built: boolean;

    public constructor(client: Client) {
        this.client = client;
        this.built = false;
    }

    public async build(): Promise<this> {
        if (this.built) {
            return this;
        }
        const events = readdirSync(resolve("dist", "Listeners"));
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        for (const event of events) {
            // eslint-disable-next-line import/no-dynamic-require
            const nevent: any = new (require(`../Listeners/${event}`).default)(this.client);
            const exec = nevent.exec.bind(nevent);
            nevent.once
            ? this.client.once(nevent.name, nevent.exec.bind(nevent))
            : this.client.on(nevent.name, exec);
            index += 1;
        }
        Logger.preload(`${this.constructor.name}: Loaded ${index} client event(s)`);
        this.built = true;
        return this;
    }
}
