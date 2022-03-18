import {
    CoffeeLava,
    CoffeeNode,
    CoffeePlayer,
    CoffeeTrack,
} from "lavacoffee";
import { Constants, GuildTextableChannel, Message } from "eris";
import type { TrackEndPayload, TrackExceptionPayload, TrackStuckPayload } from "lavacoffee/dist/utils";
import humanizeDuration from "humanize-duration";
import { env } from "process";
import InteractionManager from "../Manager/InteractionManager";
import EventManager from "../Manager/EventManager";
import Logger from "../Utils/Logger";
import Emojis from "../Utils/Emojis";
import type { ExportedTrack } from "../Typings/Track";

export default class Ready extends EventManager {
    public get name() {
        return "ready";
    }

    public get once() {
        return true;
    }

    async exec(): Promise<void> {
        this.client.editStatus("online", {
            name: "/help",
            type: Constants.ActivityTypes.GAME,
        });

        const lavalinkNodes = require("../Config/nodes.json");
        const coffee = new CoffeeLava({
            balanceLoad: "lavalink",
            clientName: "DragonIce-Bot",
            send: (guildID, voiceStatePayload) => {
                const guild = this.client.guilds.get(guildID);
                if (guild) {
                    guild.shard.sendWS(voiceStatePayload.op, voiceStatePayload.d);
                }
            },
        });

        for (const eachNode of lavalinkNodes) {
            coffee.add({
                ...eachNode,
                maxConnections: 50,
            });
        }
        coffee.init(this.client.user.id!);

        /**
         * @event {CoffeeEvents} LavaCoffee node events
         * Following applied events are: `nodeConnect`, `nodeDisconnect`, `nodeReconnect`
         * and `nodeError`
         */

        coffee.on("nodeConnect", (node: CoffeeNode) => Logger.success(`[Node Connect] ${node.options.name} has been connected.`));
        coffee.on("nodeDisconnect", (node: CoffeeNode, reason?: { code?: number, reason?: string }) => Logger.error(`[Node Disconnected] ${node.options.name} was been disconnected. Reason: ${typeof reason?.reason !== "undefined" ? reason : "unknown"}, Code: ${reason?.code ?? "unknown"}`));
        coffee.on("nodeReconnect", (node: CoffeeNode) => Logger.preload(`[Node Reconnect] Attempting to reconnect ${node.options.name}...`));
        coffee.on("nodeDestroy", (node: CoffeeNode) => Logger.error(`[Node Destroy] ${node.options.name} connected has been destroyed, no reconnection attempts.`));
        coffee.on("nodeError", (node: CoffeeNode, error: unknown) => Logger.error(`[Node Error] ${node.options.name} encountered with an error. Error is: ${error}`));

        /**
         * @event {CoffeeEvents} LavaCoffee player events
         * Following applied events are: `playerReply`, `playerMove`, `replayError`,
         * `trackStart`, `trackEnd`, `trackStuck` and `trackError`
         */

        /**
         * Important: In <Text>.createMessage function, explicitly used any type,
         * during text doesn't content createMessage as a member neither `GuildTextChannel` have it.
         */

        coffee.on("playerReplay", async (player) => {
            try {
                const text: GuildTextableChannel | undefined = player.get("text");
                await text?.createMessage({ content: `${Emojis.ahsad} Trying to replying the player, please wait...` });
            } catch (e: unknown) {
                Logger.error(`Event playerReplay encountered with an error.\n${e}`);
            }
        });
        coffee.on("playerMove", async (player, oldChannel, newChannel) => {
            if (!newChannel || newChannel === undefined) {
                if (player) {
                    player.queue.clear();
                    player.destroy();
                }
            }
        });
        coffee.on("replayError", async (player: CoffeePlayer) => {
            try {
                const text: GuildTextableChannel | undefined = player.get("text");
                await text?.createMessage({ content: `${Emojis.error} Failed to replay the player, something went wrong` });
            } catch (e: unknown) {
                Logger.error(`Event replayError encountered with an error.\n${e}`);
            }
        });
        coffee.on("trackStart", async (player: CoffeePlayer, track: ExportedTrack) => {
            try {
                const text: GuildTextableChannel | undefined = player.get("text");
                const msg = await text?.createMessage({ content: `${Emojis.startmusic} Playing **${track.title}** by ${track.requester.username} (Duration: \`${humanizeDuration(track.duration, { maxDecimalPoints: 0 })}\`)` });
                player.set("msg", msg);
            } catch (e: unknown) {
                Logger.error(`Event trackStart encountered with an error.\n${e}`);
            }
        });
        coffee.on("trackEnd", async (player: CoffeePlayer, track: CoffeeTrack, payload: TrackEndPayload) => {
            if (payload.reason === "REPLACED") return;

            const msg: Message<GuildTextableChannel> | undefined = player.get("msg");
            player.set("msg", null);
            try {
                await msg?.delete();
            } catch (e: unknown) {
                Logger.error(`Something went wrong to delete player messages.\n${e}`);
            }
        });

        coffee.on("trackStuck", async (player: CoffeePlayer, track: CoffeeTrack, payload: TrackStuckPayload) => {
            try {
                const channel: GuildTextableChannel | undefined = player.get("text");
                const msg: Message<GuildTextableChannel> | undefined = player.get("msg");
                await channel?.createMessage({ content: `<:Sad_pepe:913864792698146866> Caught track stuck in ${track.title} ->  Threshold: \`${payload.thresholdMs}\`ms` });
                player.set("msg", null);
                await msg?.delete()
                .catch(() => { });
            } catch (e: unknown) {
                Logger.error(`Something went wrong to delete player messages.\n${e}`);
            }
        });

        coffee.on("trackError", async (player: CoffeePlayer, track: CoffeeTrack, payload: TrackExceptionPayload) => {
            try {
                const channel: GuildTextableChannel | undefined = player.get("text");
                const msg: Message<GuildTextableChannel> | undefined = player.get("msg");
                await channel?.createMessage({ content: `<:Sad_pepe:913864792698146866> Caught track error in ${track.title} ->  Reason: \`${payload.exception.cause}\`, Message: \`${payload.exception.message}\`` });
                player.set("msg", null);
                await msg?.delete()
                .catch(() => { });
            } catch (e: unknown) {
                Logger.error(`Something went wrong to delete player messages.\n${e}`);
            }
        });

        this.client.coffee = coffee;

        Logger.success(`${this.client.user.username} is ready in ${this.client.guilds.size} guilds.`);
        const iManager = new InteractionManager(this.client).build();

        if (env.DEV) {
            if (!env.ACTIVE_GUILDID) {
                throw new TypeError("Development mode must have a guild id at .env file.");
            }
            (await iManager).register(env.ACTIVE_GUILDID);
        } else {
            (await iManager).register();
        }
    }
}
