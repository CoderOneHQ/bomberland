import { EndGameFireSpreader } from "../Entity/World/EndGameFireSpreader/EndGameFireSpreader";
import { GameTicker } from "./GameTicker";
import { handleUnitAction } from "../handleUnitAction/handleUnitAction";
import { sortAgentActionQueue } from "./sortAgentActionQueue";
import { Telemetry } from "../../Services/Telemetry";
import { World } from "../Entity/World/World";
import {
    AgentBombPacket,
    AgentDetonatePacket,
    AgentMovePacket,
    AgentPacket,
    GameEvent,
    GameEventType,
    IAgentHashMap,
    IAgentState,
    IEndGameState,
    IGameState,
    IGameTick,
    IUnitState,
    PacketType,
} from "@coderone/bomberland-library";
import { getFilteredSameCellActions } from "./getFilteredSameCellActions";
import { IConfig } from "../../Config/IConfig";

export class Game {
    private queuedAgentActions: Array<[string, AgentPacket]> = [];
    private readonly lastActionMap = new Map<string, number>();
    private readonly initialGameState: Omit<IGameState, "connection">;
    private readonly history: Array<IGameTick> = [];
    private endGameFireSpreader: EndGameFireSpreader;

    public constructor(
        private telemetry: Telemetry,
        private config: IConfig,
        private id: string,
        private gameTicker: GameTicker,
        private world: World,
        private tickRateHz: number,
        private gameDurationTicks: number,
        private fireSpawnIntervalTicks: number
    ) {
        this.initialGameState = this.GetCurrentGameState();
        this.endGameFireSpreader = new EndGameFireSpreader(config, world, gameTicker, fireSpawnIntervalTicks);
    }

    public IsGameComplete = (): boolean => {
        const units = this.world.UnitMap;
        const agentUnitsAliveMap = new Map<string, number>();
        units.forEach((unit) => {
            const { AgentId, HP } = unit;

            if (HP > 0) {
                const currentAlive = agentUnitsAliveMap.get(AgentId) ?? 0;
                agentUnitsAliveMap.set(AgentId, currentAlive + 1);
            }
        });

        return agentUnitsAliveMap.size <= 1;
    };

    public GetCurrentGameState = (): Omit<IGameState, "connection"> => {
        const { units, entities } = this.world.WorldState;
        const unitsMap: {
            [unitId: string]: IUnitState;
        } = {};
        const agents: IAgentHashMap = {};
        units.forEach((unit) => {
            unitsMap[`${unit.unit_id}`] = unit;
            const { unit_id, agent_id } = unit;
            const isAgentUndefined = agents[agent_id] === undefined;

            if (isAgentUndefined) {
                const agentState: IAgentState = {
                    agent_id: agent_id,
                    unit_ids: [],
                };
                agents[agent_id] = agentState;
            }
            agents[agent_id].unit_ids.push(unit_id);
        });

        return {
            game_id: this.id,
            agents,
            unit_state: unitsMap,
            entities: [...entities],
            world: {
                width: this.world.Width,
                height: this.world.Height,
            },
            tick: this.gameTicker.CurrentTick,
            config: {
                tick_rate_hz: this.tickRateHz,
                game_duration_ticks: this.gameDurationTicks,
                fire_spawn_interval_ticks: this.fireSpawnIntervalTicks,
            },
        };
    };

    public GetEndGameState = (): IEndGameState => {
        const { units: units } = this.world.WorldState;

        const winningAgent = units.find((agent) => {
            const isAlive = agent.hp > 0;
            return isAlive === true;
        });
        const winningAgentId = winningAgent?.agent_id ?? null;
        return { initial_state: this.initialGameState, history: [...this.history], winning_agent_id: winningAgentId };
    };

    public GetTickResult = async (): Promise<IGameTick> => {
        this.gameTicker.Increment();
        const currentTick = this.gameTicker.CurrentTick;
        const endGameFireEvents = this.endGameFireSpreader.Spread();
        const expiryEvents = this.world.Tick();
        const agentActions = [...this.queuedAgentActions];

        this.queuedAgentActions = [];
        const successfulActions = this.processAgentActions(agentActions);

        const flushedWorldBuffer = this.world.FlushWorldTickEventBuffer();
        const result: IGameTick = {
            tick: currentTick,
            events: [...endGameFireEvents, ...expiryEvents, ...successfulActions, ...flushedWorldBuffer],
        };
        if (result.events.length > 0) {
            this.history.push(result);
        }
        return result;
    };

    public QueueAction = (packet: AgentPacket, agentId: string) => {
        const { unit_id } = packet;
        const isValidAction = this.isActionValid(packet, agentId, unit_id);
        if (isValidAction) {
            switch (packet.type) {
                case PacketType.Bomb:
                    this.telemetry.Info(`Queueing action: ${packet.type} for agent: ${agentId}, unitId: ${unit_id}`);
                    this.queuedAgentActions.push([agentId, packet]);
                    break;
                case PacketType.Move:
                    this.telemetry.Info(`Queueing action: ${packet.move} for agent: ${agentId}, unitId: ${unit_id}`);
                    this.queuedAgentActions.push([agentId, packet]);
                    break;
                case PacketType.Detonate:
                    this.telemetry.Info(`Queueing action: ${packet.type} for agent: ${agentId}, unitId: ${unit_id}`);
                    this.queuedAgentActions.push([agentId, packet]);
                    break;
                default:
                    this.telemetry.Error(`Unhandled packet: ${JSON.stringify(packet)}`);
            }
        }
    };

    private isActionValid = (action: AgentPacket, agentId: string, unitId: string): boolean => {
        const currentTick = this.gameTicker.CurrentTick;
        const lastActionTaken = this.lastActionMap.get(unitId) ?? -1;
        const isActionThrottled = lastActionTaken >= currentTick;
        const unit = this.world.UnitMap.get(unitId);
        const canControlUnit = unit?.AgentId === agentId;
        const unitHealth = unit?.HP ?? 0;
        const isUnitAlive = unitHealth > 0;
        if (canControlUnit === false) {
            this.telemetry.Info(
                `Dropping action (doesn't own unit): ${JSON.stringify(action.type)} for agent: ${agentId}, unit: ${unitId}`
            );
            return false;
        } else if (isUnitAlive === false) {
            this.telemetry.Info(`Dropping action (unit is dead): ${JSON.stringify(action.type)} for agent: ${agentId}, unit: ${unitId}`);
            return false;
        } else if (isActionThrottled) {
            this.telemetry.Info(`Throttling action: ${JSON.stringify(action.type)} for agent: ${agentId}, unit: ${unitId}`);
            return false;
        } else {
            this.lastActionMap.set(unitId, currentTick);
            return true;
        }
    };

    private processAgentActions = (actions: Array<[string, AgentPacket]>): Array<GameEvent> => {
        sortAgentActionQueue(actions);
        const nonMoveActions: Array<[string, AgentDetonatePacket | AgentBombPacket]> = [];
        const moveActions: Array<[string, AgentMovePacket]> = [];
        actions.forEach((move) => {
            const [agentId, action] = move;
            if (action.type !== PacketType.Move) {
                nonMoveActions.push([agentId, action]);
            } else {
                moveActions.push([agentId, action]);
            }
        });
        const filteredActions = getFilteredSameCellActions(this.telemetry, moveActions, this.world.UnitMap, this.world.Width);

        return [...this.handleActions(nonMoveActions), ...this.handleActions(filteredActions)];
    };

    private handleActions = (actions: Array<[string, AgentPacket]>): Array<GameEvent> => {
        const successfulActions: Array<[string, AgentPacket]> = [];
        const gameEvents: Array<GameEvent> = [];
        actions.forEach((move) => {
            const [agentId, agentPacket] = move;
            const { unit_id } = agentPacket;
            try {
                const unit = this.world.GetUnit(unit_id);
                handleUnitAction(this.telemetry, agentPacket, unit, this.world, this.gameTicker, this.config);
                successfulActions.push(move);
            } catch (e) {
                console.log(agentPacket);
                this.telemetry.Error(`Failed to run action for agent: ${agentId}, unitId: ${unit_id} with error: ${e}`);
            }
        });
        successfulActions.map((action) => {
            const [agentNumber, packet] = action;
            gameEvents.push({ type: GameEventType.UnitAction, agent_id: agentNumber, data: packet });
        });
        const worldEvents = this.world.FlushWorldTickEventBuffer();
        return [...gameEvents, ...worldEvents];
    };
}
