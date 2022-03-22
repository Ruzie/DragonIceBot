import { Client } from "eris";
import { EventEmitter } from "events";

export default abstract class EventStruct extends EventEmitter {
    public client: Client;

    public name: string | undefined;

    public run: any;

    public constructor(client: Client) {
        super();
        this.client = client;
        if (!this.name || this.name === undefined) {
            throw new TypeError(`Extended ${this.constructor.name} must have a getter 'name'`);
        }
        if (typeof this.once !== "boolean" || this.once === undefined) {
            throw new TypeError(`Extended ${this.constructor.name} must have a getter 'once'.`);
        }
        if (this.run === undefined) {
            throw new TypeError(`Extended ${this.constructor.name} must have an async 'run' function. `);
        }
        if (this.run.constructor.name !== "AsyncFunction") {
            throw new TypeError(`Extended ${this.constructor.name} must have an async 'run' function name.`);
        }
        this.on("error", (error: unknown) => console.log(error));
    }

    exec(...args: Array<unknown>) {
        this.run(...args)
        .catch((error: unknown) => this.emit("error", error));
    }
}
