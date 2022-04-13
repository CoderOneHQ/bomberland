import { AgentPacket, IGameState, IGameTick } from "@coderone/bomberland-library";
import { createGameFromState } from "../Game/createGameFromState";
import { Telemetry } from "../../Services/Telemetry";
export interface INextState {
    readonly next_state: Omit<IGameState, "connection">;
    readonly is_complete: boolean;
    readonly tick_result: IGameTick;
}

export const evaluateNextState = async (
    telemetry: Telemetry,
    state: Omit<IGameState, "connection">,
    forwardActions: Array<{
        readonly agent_id: string;
        readonly action: AgentPacket;
    }>
): Promise<INextState> => {
    const game = createGameFromState(telemetry, state);
    forwardActions.forEach((forwardAction) => {
        const { action, agent_id } = forwardAction;
        game.QueueAction(action, agent_id);
    });
    const tickResult = await game.GetTickResult();
    return { next_state: game.GetCurrentGameState(), is_complete: game.IsGameComplete(), tick_result: tickResult };
};
