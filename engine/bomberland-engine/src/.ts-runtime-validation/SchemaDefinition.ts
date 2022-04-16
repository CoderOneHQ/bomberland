import { IHashMapObject } from "../ValidationTypes/IHashMapObject.jsonschema";
import { ValidAdminPacket, AdminPacket, EvaluateNextStatePacket, IAgentHashMap, IAgentState, IUnitStateHashMap, IUnitState, IEntity, EntityType, AgentPacket, AgentDetonatePacket, AgentMovePacket, UnitMove, AgentBombPacket, RequestTickPacket, RequestGameReset, ValidAgentPacket, ValidServerPacket, ServerPacket, GameStatePacket, IGameState, GameRole, GameTickPacket, IGameTick, GameEvent, IAgentActionEvent, IEntitySpawnedEvent, IEntityExpiredEvent, IAgentStateEvent, IEntityStateEvent, EndGameStatePacket, IEndGameState, InfoPacket, NextGameStatePacket } from "../ValidationTypes/Library.types.jsonschema";

const schemas: Record<keyof ISchema, string> = {
    ["#/definitions/IHashMapObject"] : "IHashMapObject",
    ["#/definitions/ValidAdminPacket"] : "ValidAdminPacket",
    ["#/definitions/AdminPacket"] : "AdminPacket",
    ["#/definitions/EvaluateNextStatePacket"] : "EvaluateNextStatePacket",
    ["#/definitions/IAgentHashMap"] : "IAgentHashMap",
    ["#/definitions/IAgentState"] : "IAgentState",
    ["#/definitions/IUnitStateHashMap"] : "IUnitStateHashMap",
    ["#/definitions/IUnitState"] : "IUnitState",
    ["#/definitions/IEntity"] : "IEntity",
    ["#/definitions/EntityType"] : "EntityType",
    ["#/definitions/AgentPacket"] : "AgentPacket",
    ["#/definitions/AgentDetonatePacket"] : "AgentDetonatePacket",
    ["#/definitions/AgentMovePacket"] : "AgentMovePacket",
    ["#/definitions/UnitMove"] : "UnitMove",
    ["#/definitions/AgentBombPacket"] : "AgentBombPacket",
    ["#/definitions/RequestTickPacket"] : "RequestTickPacket",
    ["#/definitions/RequestGameReset"] : "RequestGameReset",
    ["#/definitions/ValidAgentPacket"] : "ValidAgentPacket",
    ["#/definitions/ValidServerPacket"] : "ValidServerPacket",
    ["#/definitions/ServerPacket"] : "ServerPacket",
    ["#/definitions/GameStatePacket"] : "GameStatePacket",
    ["#/definitions/IGameState"] : "IGameState",
    ["#/definitions/GameRole"] : "GameRole",
    ["#/definitions/GameTickPacket"] : "GameTickPacket",
    ["#/definitions/IGameTick"] : "IGameTick",
    ["#/definitions/GameEvent"] : "GameEvent",
    ["#/definitions/IAgentActionEvent"] : "IAgentActionEvent",
    ["#/definitions/IEntitySpawnedEvent"] : "IEntitySpawnedEvent",
    ["#/definitions/IEntityExpiredEvent"] : "IEntityExpiredEvent",
    ["#/definitions/IAgentStateEvent"] : "IAgentStateEvent",
    ["#/definitions/IEntityStateEvent"] : "IEntityStateEvent",
    ["#/definitions/EndGameStatePacket"] : "EndGameStatePacket",
    ["#/definitions/IEndGameState"] : "IEndGameState",
    ["#/definitions/InfoPacket"] : "InfoPacket",
    ["#/definitions/NextGameStatePacket"] : "NextGameStatePacket",
    }
;

interface ISchema {
    readonly ["#/definitions/IHashMapObject"]: IHashMapObject;
    readonly ["#/definitions/ValidAdminPacket"]: ValidAdminPacket;
    readonly ["#/definitions/AdminPacket"]: AdminPacket;
    readonly ["#/definitions/EvaluateNextStatePacket"]: EvaluateNextStatePacket;
    readonly ["#/definitions/IAgentHashMap"]: IAgentHashMap;
    readonly ["#/definitions/IAgentState"]: IAgentState;
    readonly ["#/definitions/IUnitStateHashMap"]: IUnitStateHashMap;
    readonly ["#/definitions/IUnitState"]: IUnitState;
    readonly ["#/definitions/IEntity"]: IEntity;
    readonly ["#/definitions/EntityType"]: EntityType;
    readonly ["#/definitions/AgentPacket"]: AgentPacket;
    readonly ["#/definitions/AgentDetonatePacket"]: AgentDetonatePacket;
    readonly ["#/definitions/AgentMovePacket"]: AgentMovePacket;
    readonly ["#/definitions/UnitMove"]: UnitMove;
    readonly ["#/definitions/AgentBombPacket"]: AgentBombPacket;
    readonly ["#/definitions/RequestTickPacket"]: RequestTickPacket;
    readonly ["#/definitions/RequestGameReset"]: RequestGameReset;
    readonly ["#/definitions/ValidAgentPacket"]: ValidAgentPacket;
    readonly ["#/definitions/ValidServerPacket"]: ValidServerPacket;
    readonly ["#/definitions/ServerPacket"]: ServerPacket;
    readonly ["#/definitions/GameStatePacket"]: GameStatePacket;
    readonly ["#/definitions/IGameState"]: IGameState;
    readonly ["#/definitions/GameRole"]: GameRole;
    readonly ["#/definitions/GameTickPacket"]: GameTickPacket;
    readonly ["#/definitions/IGameTick"]: IGameTick;
    readonly ["#/definitions/GameEvent"]: GameEvent;
    readonly ["#/definitions/IAgentActionEvent"]: IAgentActionEvent;
    readonly ["#/definitions/IEntitySpawnedEvent"]: IEntitySpawnedEvent;
    readonly ["#/definitions/IEntityExpiredEvent"]: IEntityExpiredEvent;
    readonly ["#/definitions/IAgentStateEvent"]: IAgentStateEvent;
    readonly ["#/definitions/IEntityStateEvent"]: IEntityStateEvent;
    readonly ["#/definitions/EndGameStatePacket"]: EndGameStatePacket;
    readonly ["#/definitions/IEndGameState"]: IEndGameState;
    readonly ["#/definitions/InfoPacket"]: InfoPacket;
    readonly ["#/definitions/NextGameStatePacket"]: NextGameStatePacket;
}

export { schemas, ISchema };
