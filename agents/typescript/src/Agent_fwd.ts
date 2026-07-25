import { AgentPacket, EntityType, GameStateClient, IGameState, PacketType, UnitMove } from "@coderone/bomberland-library";
import { ForwardAction, ForwardModel, NextStatePayload } from "./ForwardModel";

const gameConnectionString =
    process.env["GAME_CONNECTION_STRING"] || "ws://127.0.0.1:3000/?role=agent&agentId=agentIdA&name=RandomAgentFwd";
const fwdModelConnectionString = process.env["FWD_MODEL_CONNECTION_STRING"] || "ws://127.0.0.1:6969/?role=admin";

enum Action {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right",
    Bomb = "bomb",
    Detonate = "detonate",
}

const actionMoveMap = new Map<Action, UnitMove>([
    [Action.Up, UnitMove.Up],
    [Action.Down, UnitMove.Down],
    [Action.Left, UnitMove.Left],
    [Action.Right, UnitMove.Right],
]);

const actionList = Object.values(Action);

class Agent {
    private readonly client = new GameStateClient(gameConnectionString);
    private readonly forwardModel = new ForwardModel(fwdModelConnectionString);
    private sequenceId = 0;

    public constructor() {
        this.client.SetGameTickCallback(this.onGameTick);
        this.forwardModel.SetNextStateCallback(this.onNextGameState);
    }

    private onGameTick = async (gameState: Omit<IGameState, "connection"> | undefined) => {
        if (gameState === undefined) {
            return;
        }

        // Forward-model demo: ask "what happens next tick if all my units move right?"
        // before committing to a real action. A real agent would evaluate several candidate
        // action sets and pick the best-scoring resulting state.
        this.evaluateNextState(gameState);

        const myAgentId = this.client.Connection?.agent_id ?? "";
        const units = gameState.agents[myAgentId]?.unit_ids ?? [];
        units.forEach((unitId) => {
            const action = this.generateAction();
            if (action) {
                const mappedMove = actionMoveMap.get(action);
                if (mappedMove !== undefined) {
                    this.client.SendMove(unitId, mappedMove);
                } else if (action === Action.Bomb) {
                    this.client.SendPlaceBomb(unitId);
                } else if (action === Action.Detonate) {
                    const bombCoordinates = this.getBombToDetonate(gameState);
                    if (bombCoordinates !== undefined) {
                        this.client.SendDetonateBomb(unitId, bombCoordinates);
                    }
                }
            }
        });
    };

    private evaluateNextState = (gameState: Omit<IGameState, "connection">) => {
        const myAgentId = this.client.Connection?.agent_id ?? "";
        const units = gameState.agents[myAgentId]?.unit_ids ?? [];
        const actions: Array<ForwardAction> = units.map((unitId) => {
            const action: AgentPacket = { type: PacketType.Move, move: UnitMove.Right, unit_id: unitId };
            return { agent_id: myAgentId, action };
        });
        this.forwardModel.SendEvaluateNextState(this.sequenceId++, gameState, actions);
    };

    private onNextGameState = (payload: NextStatePayload) => {
        // The forward model has simulated the hypothetical actions. `payload.next_state` is the
        // resulting state you would score in a search; here we just log a summary.
        console.log(
            `Forward model seq=${payload.sequence_id}: is_complete=${payload.is_complete}, ` +
                `resulting events=${payload.tick_result.events.length}, next tick=${payload.next_state.tick}`
        );
    };

    private generateAction = (): Action | undefined => {
        const allActions = actionList.length;
        const rand = Math.round(Math.random() * allActions);
        if (rand !== allActions) {
            return actionList[rand];
        }
    };

    private getBombToDetonate = (gameState: Omit<IGameState, "connection">): [number, number] | undefined => {
        const currentAgent = this.client.Connection?.agent_id;
        const bomb = gameState.entities.find((entity) => {
            const isBomb = entity.type === EntityType.Bomb;
            const isOwner = currentAgent !== undefined ? entity.agent_id === currentAgent : false;
            return isBomb === true && isOwner === true;
        });

        if (bomb?.x !== undefined && bomb.y !== undefined) {
            return [bomb.x, bomb.y];
        }
    };
}

new Agent();
