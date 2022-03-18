export interface VoiceServerUpdate {
    op: 0;
    s: number;
    t: "VOICE_SERVER_UPDATE";
    d: {
        token: string;
        guild_id: string;
        endpoint: string;
    };
}
export interface VoiceStateUpdate {
    op: 0;
    s: number;
    t: "VOICE_STATE_UPDATE";
    d: {
        guild_id: string;
        channel_id?: string;
        user_id: string;
        session_id: string;
        deaf: boolean;
        mute: boolean;
        self_deaf: boolean;
        self_mute: boolean;
        self_stream?: boolean;
        self_video: boolean;
        suppress: boolean;
        request_to_speak_timestamp?: number;
    };
}
