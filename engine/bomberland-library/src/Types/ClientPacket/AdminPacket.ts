import { AgentPacket } from "./AgentPacket";
import { IGameState } from "../Game.types";
import { PacketType } from "../Connection.types";

export interface RequestGameReset {
    readonly type: PacketType.RequestGameReset;
    readonly world_seed?: number;
    readonly prng_seed?: number;
}

export interface RequestTickPacket {
    readonly type: PacketType.RequestTick;
}

export interface EvaluateNextStatePacket {
    readonly type: PacketType.EvaluateNextState;
    readonly sequence_id: number;
    readonly state: Omit<IGameState, "connection">;
    readonly actions: Array<{
        readonly agent_id: string;
        readonly action: AgentPacket;
    }>;
}

export type AdminPacket = EvaluateNextStatePacket | RequestTickPacket | RequestGameReset;
