import { IEndGameState, IGameState, IGameTick } from "../Game.types";
import { PacketType } from "../Connection.types";

export interface GameTickPacket {
    readonly type: PacketType.Tick;
    readonly payload: IGameTick;
}

export interface GameStatePacket {
    readonly type: PacketType.GameState;
    readonly payload: IGameState;
}

export interface EndGameStatePacket {
    readonly type: PacketType.EndGameState;
    readonly payload: IEndGameState;
}

export interface InfoPacket {
    readonly type: PacketType.Info;
    readonly payload: { readonly message: string };
}

export interface NextGameStatePacket {
    readonly type: PacketType.NextGameState;
    readonly payload: {
        readonly sequence_id: number;
        readonly is_complete: boolean;
        readonly tick_result: IGameTick;
        readonly next_state: Omit<IGameState, "connection">;
    };
}

export type ServerPacket = GameStatePacket | GameTickPacket | EndGameStatePacket | InfoPacket | NextGameStatePacket;
