import { GameEvent } from "./GameEvent.types";

export enum EntityType {
    Ammo = "a",
    Bomb = "b",
    Blast = "x",
    BlastPowerup = "bp",
    FreezePowerup = "fp",
    MetalBlock = "m",
    OreBlock = "o",
    TreasureChest = "t",
    WoodBlock = "w",
}

export interface IEntity {
    /* type of object */
    readonly type: EntityType;
    /* health of object for destructible blocks */
    readonly hp?: number;
    /* cartesian x coordinate of item */
    readonly x: number;
    /* cartesian y coordinate of item */
    readonly y: number;
    /* unit who owns the entity not defined if nobody */
    readonly unit_id?: string;
    /* agent who owns the entity not defined if nobody */
    readonly agent_id?: string;
    /* tick number when the item disappears */
    readonly created: number;
    readonly expires?: number;
    /* blast_diameter if entity is bomb */
    readonly blast_diameter?: number;
}

export interface IUnitStateHashMap {
    [unitId: string]: IUnitState;
}

export interface IAgentHashMap {
    [agentId: string]: IAgentState;
}

export interface IGameState {
    readonly game_id: string;
    readonly tick: number;
    readonly agents: IAgentHashMap;
    readonly unit_state: IUnitStateHashMap;
    readonly entities: Array<IEntity>;
    readonly world: {
        readonly width: number;
        readonly height: number;
    };
    readonly config: {
        readonly game_duration_ticks: number;
        readonly tick_rate_hz: number;
        readonly fire_spawn_interval_ticks: number;
    };
    readonly connection: { id: number; role: GameRole; agent_id: string | null };
}

export interface IEndGameState {
    readonly initial_state: Omit<IGameState, "connection">;
    readonly history: Array<IGameTick>;
    readonly winning_agent_id: string | null;
}

export enum GameRole {
    Admin = "admin",
    Agent = "agent",
    Spectator = "spectator",
}

export interface IAgentState {
    readonly agent_id: string;
    readonly unit_ids: Array<string>;
}

export interface IUnitState {
    readonly agent_id: string;
    readonly unit_id: string;
    readonly coordinates: [number, number];
    readonly inventory: {
        readonly bombs: number;
    };
    readonly blast_diameter: number;
    readonly hp: number;
    readonly invulnerable: number;
    readonly stunned: number;
}

export interface IGameTick {
    readonly events: Array<GameEvent>;
    readonly tick: number;
}
