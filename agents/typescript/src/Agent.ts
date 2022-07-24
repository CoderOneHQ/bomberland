import { UnitMove, EntityType, GameStateClient, IGameState } from "@coderone/bomberland-library";

const gameConnectionString = process.env["GAME_CONNECTION_STRING"] || "ws://127.0.0.1:3000/?role=agent&agentId=agentIdA&name=RandomAgent";
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
    public constructor() {
        this.client.SetGameTickCallback(this.onGameTick);
    }

    private onGameTick = async (gameState: Omit<IGameState, "connection"> | undefined) => {
        if (gameState === undefined) {
            return;
        }
        const myAgentId = this.client.Connection?.agent_id ?? "";
        const units = gameState.agents[myAgentId].unit_ids;
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
