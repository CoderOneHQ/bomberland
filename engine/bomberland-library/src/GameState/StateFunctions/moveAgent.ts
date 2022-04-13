import { UnitMove } from "../../Types/ClientPacket/AgentPacket";
import { IGameState } from "../../Types/Game.types";

export const moveActionSet = new Set<UnitMove>([UnitMove.Up, UnitMove.Down, UnitMove.Left, UnitMove.Right]);

const getNewCoordinates = (oldCoordinates: [number, number], action: UnitMove): [number, number] => {
    const [x, y] = oldCoordinates;
    switch (action) {
        case UnitMove.Up:
            return [x, y + 1];
        case UnitMove.Down:
            return [x, y - 1];
        case UnitMove.Left:
            return [x - 1, y];
        case UnitMove.Right:
            return [x + 1, y];
        default:
            return [x, y];
    }
};

export const moveAgent = (agentId: string, move: UnitMove, state: Omit<IGameState, "connection">): Omit<IGameState, "connection"> => {
    const agent = state.unit_state[`${agentId}`];
    const isInvalidMove = moveActionSet.has(move) === false;
    if (agent === undefined || isInvalidMove) {
        return state;
    }
    const newCoordinates = getNewCoordinates(agent.coordinates, move);
    const newState: Omit<IGameState, "connection"> = { ...state };
    newState.unit_state[`${agentId}`] = { ...agent, coordinates: newCoordinates };
    return newState;
};
