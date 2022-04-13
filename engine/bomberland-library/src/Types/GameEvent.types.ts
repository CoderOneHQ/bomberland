import { AgentPacket } from "./ClientPacket";
import { IUnitState, IEntity } from "./Game.types";

export enum GameEventType {
    UnitAction = "unit",
    UnitState = "unit_state",
    EntityExpired = "entity_expired",
    EntitySpawned = "entity_spawned",
    EntityState = "entity_state",
}

export interface IAgentActionEvent {
    readonly type: GameEventType.UnitAction;
    readonly agent_id: string;
    readonly data: AgentPacket;
}

type Coordinates = [number, number];

export interface IEntityExpiredEvent {
    readonly type: GameEventType.EntityExpired;
    readonly data: Coordinates;
}

export interface IEntityStateEvent {
    readonly type: GameEventType.EntityState;
    readonly coordinates: Coordinates;
    readonly updated_entity: IEntity;
}

export interface IEntitySpawnedEvent {
    readonly type: GameEventType.EntitySpawned;
    readonly data: IEntity;
}

export interface IAgentStateEvent {
    readonly type: GameEventType.UnitState;
    readonly data: IUnitState;
}

export type GameEvent = IAgentActionEvent | IEntitySpawnedEvent | IEntityExpiredEvent | IAgentStateEvent | IEntityStateEvent;
