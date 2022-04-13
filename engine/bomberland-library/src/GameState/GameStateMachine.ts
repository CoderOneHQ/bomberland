import { AgentPacket, GameEventType, IEntityExpiredEvent, IGameState, IGameTick, PacketType } from "..";
import { expireEntity } from "./StateFunctions/expireEntity";
import { moveActionSet, moveAgent } from "./StateFunctions/moveAgent";
import { spawnEntity } from "./StateFunctions/spawnEntity";
import { updateAgentState } from "./StateFunctions/updateAgentState";
import { updateEntityState } from "./StateFunctions/updateEntityState";

export class GameStateMachine {
    public get State(): Omit<IGameState, "connection"> {
        return { ...this.state };
    }
    public constructor(private state: Omit<IGameState, "connection">) {}

    public Update = (tick: IGameTick) => {
        this.state = { ...this.state, tick: tick.tick };
        tick.events.forEach((event) => {
            switch (event.type) {
                case GameEventType.UnitAction:
                    const { data } = event;
                    const { unit_id } = data;
                    this.processUnitAction(unit_id, data);
                    break;
                case GameEventType.EntityExpired:
                    this.processExpiry(event);
                    break;
                case GameEventType.EntitySpawned:
                    if (this.state) {
                        const updatedEntities = spawnEntity(event.data, this.state.entities);
                        this.state = { ...this.state, entities: updatedEntities };
                    }
                    break;
                case GameEventType.UnitState:
                    if (this.state) {
                        this.state = { ...this.state, unit_state: updateAgentState(event.data, this.state.unit_state) };
                    }
                    break;
                case GameEventType.EntityState:
                    if (this.state) {
                        this.state = { ...this.state, entities: updateEntityState(event, this.state.entities) };
                    }
                    break;
                default:
                    console.info("unknown event type");
            }
        });
    };

    private processUnitAction = (unitId: string, agentPacket: AgentPacket) => {
        if (agentPacket.type === PacketType.Move) {
            const { move } = agentPacket;
            const shouldProcessAgentMovement = moveActionSet.has(move);
            if (shouldProcessAgentMovement) {
                this.state = this.state && moveAgent(unitId, move, this.state);
            } else {
                console.error(`unhandled action for agent ${unitId}:`);
                console.error(agentPacket);
            }
        }
    };

    private processExpiry = (expiryEvent: IEntityExpiredEvent) => {
        if (this.state) {
            const updatedEntities = expireEntity(expiryEvent, this.state.entities);
            this.state = { ...this.state, entities: updatedEntities };
        }
    };
}
