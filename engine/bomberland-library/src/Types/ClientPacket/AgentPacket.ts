import { PacketType } from "../Connection.types";

export enum UnitMove {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
}

export interface AgentMovePacket {
    readonly type: PacketType.Move;
    readonly move: UnitMove;
    readonly unit_id: string;
}

export interface AgentBombPacket {
    readonly type: PacketType.Bomb;
    readonly unit_id: string;
}

export interface AgentDetonatePacket {
    readonly type: PacketType.Detonate;
    readonly coordinates: [number, number];
    readonly unit_id: string;
}

export type AgentPacket = AgentDetonatePacket | AgentMovePacket | AgentBombPacket;
