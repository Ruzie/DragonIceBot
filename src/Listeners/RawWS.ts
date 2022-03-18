import type { VoiceServerUpdate, VoiceStateUpdate } from "../Typings/Packets";
import EventManager from "../Manager/EventManager";

export default class RawWS extends EventManager {
    public get name() {
        return "rawWS";
    }

    public get once() {
        return false;
    }

    async exec(data: VoiceStateUpdate | VoiceServerUpdate): Promise<void> {
        ["VOICE_STATE_UPDATE", "VOICE_SERVER_UPDATE"]
        .forEach((e) => {
            if (data.t !== e) {
                return null;
            }
            this.client.coffee.updateVoiceData(data);
            return null;
        });
    }
}
