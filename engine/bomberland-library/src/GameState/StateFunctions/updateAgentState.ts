import { IUnitState, IUnitStateHashMap } from "../../Types/Game.types";

export const updateAgentState = (agentState: IUnitState, agentStateMap: IUnitStateHashMap): IUnitStateHashMap => {
    const agentNumber = agentState.unit_id;
    const newState = { ...agentStateMap };
    newState[agentNumber] = agentState;
    return newState;
};
