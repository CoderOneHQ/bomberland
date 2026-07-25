import WebSocket from "ws";
import { AgentPacket, EvaluateNextStatePacket, IGameState, NextGameStatePacket, PacketType } from "@coderone/bomberland-library";

export type ForwardAction = {
    readonly agent_id: string;
    readonly action: AgentPacket;
};

export type NextStatePayload = NextGameStatePacket["payload"];
export type NextStateCallback = (payload: NextStatePayload) => void;

/**
 * Client for the forward-model simulator. The forward model is a separate engine instance run
 * with `role=admin` (see the `fwd-server` service in open-ai-gym-wrapper-compose.yml, default
 * port 6969). You send it a state plus a set of hypothetical actions and it returns the
 * resulting next state — useful for lookahead / tree search without mutating the live game.
 *
 * The bundled `@coderone/bomberland-library` GameStateClient can send EvaluateNextState but does
 * not surface the `next_game_state` reply, so this small client owns its own socket instead.
 */
export class ForwardModel {
    private readonly socket: WebSocket;
    private onNextState: NextStateCallback | undefined;

    public constructor(connectionString: string) {
        this.socket = new WebSocket(connectionString);
        this.attachHandlers();
    }

    public SetNextStateCallback = (callback: NextStateCallback | undefined): void => {
        this.onNextState = callback;
    };

    /**
     * Ask the forward model to evaluate `actions` applied to `state`.
     * `sequenceId` correlates the response, since replies may arrive out of order.
     */
    public SendEvaluateNextState = (
        sequenceId: number,
        state: Omit<IGameState, "connection">,
        actions: ReadonlyArray<ForwardAction>
    ): void => {
        const packet: EvaluateNextStatePacket = {
            type: PacketType.EvaluateNextState,
            sequence_id: sequenceId,
            state,
            actions: [...actions],
        };
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(packet));
        }
    };

    public Destroy = (): void => {
        this.socket.close();
    };

    private attachHandlers = (): void => {
        this.socket.on("open", () => {
            console.log("Forward model connection opened");
        });
        this.socket.on("message", (data: WebSocket.RawData) => {
            try {
                const packet = JSON.parse(data.toString());
                if (packet.type === PacketType.NextGameState) {
                    this.onNextState?.((packet as NextGameStatePacket).payload);
                }
                // Other packets on the admin socket (e.g. info) are not needed here.
            } catch (error) {
                console.error(`Failed to parse forward-model message: ${error}`);
            }
        });
        this.socket.on("error", (error) => {
            console.error(`Forward model socket error: ${error}`);
        });
    };
}
