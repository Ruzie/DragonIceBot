import { Client } from "eris";

export default abstract class InteractionStruct {
    public cmdName: string | undefined;

    public client: Client;

    public category: string | undefined;

    private accessName: string | undefined;

    private accessDescription: string | undefined;

    private accessOptions: any;

    public get name(): string | undefined {
        return this.accessName;
    }

    public set name(value: string | undefined) {
        this.accessName = value;
    }

    public get description(): string | undefined {
        return this.accessDescription;
    }

    public set description(value: string | undefined) {
        this.accessDescription = value;
    }

    public get options(): Array<unknown> | undefined {
        return this.accessOptions;
    }

    public set options(value: Array<unknown> | undefined) {
        this.accessOptions = value;
    }

    public constructor(client: Client) {
        this.cmdName = this.name;
        this.client = client;
        this.category = undefined;

        if (!this.name || this.name === undefined) {
            throw new TypeError(`Extended ${this.constructor.name} must have a getter 'name'.`);
        }
        if (!this.description || this.description === undefined) {
            throw new TypeError(`Extended ${this.constructor.name} must have a getter 'description'.`);
        }
    }

    public get interactionData() {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
        };
    }
}
