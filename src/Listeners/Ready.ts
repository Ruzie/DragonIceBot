import InteractionManager from "../Manager/InteractionManager";
import EventManager from "../Manager/EventManager";

export default class Ready extends EventManager {
    public get name() {
        return "ready";
    }

    public get once() {
        return true;
    }

    async exec() {
        console.log(`ready${this.client.guilds.size}`);
        const rr = new InteractionManager(this.client).build();
        (await rr).register("900024857071353896");
    }
}
