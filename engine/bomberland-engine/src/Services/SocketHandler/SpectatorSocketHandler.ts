import ws from "ws";
import { AbstractSocketHandler } from "./AbstractSocketHandler";
import { ConnectionTracker } from "../ConnectionTracker";
import { GameRole } from "@coderone/bomberland-library";
import { Telemetry } from "../Telemetry";

export class SpectatorSocketHandler extends AbstractSocketHandler {
    public AgentId = null;
    public Role = GameRole.Spectator;

    public constructor(
        private telemetry: Telemetry,
        private connection: ws.Server,
        public ConnectionId: number,
        private connectionTracker: ConnectionTracker,
        private onConnection?: (connection: AbstractSocketHandler) => void
    ) {
        super();
        this.instantiateSocketHandler();
    }

    protected instantiateSocketHandler = () => {
        this.connection.on("close", this.onClose());
        this.connection.on("error", (error: Error) => {
            this.telemetry.Error(`Spectator socket error (${this.ConnectionId}): ${error.message}`);
        });
        this.onConnection?.(this);
        this.telemetry.Info(`Spectator (${this.ConnectionId}) connected to the server`);
    };

    public Send = (message: string) => {
        const socket = this.connection as ws.Server & { send: (message: string) => void; readyState: number };
        if (socket.readyState !== ws.OPEN) {
            return;
        }
        try {
            socket.send(message);
        } catch (error) {
            this.telemetry.Error(`Failed to send to spectator ${this.ConnectionId}: ${error}`);
        }
    };

    private onClose = () => {
        return () => {
            this.telemetry.Info(`Spectator ${this.ConnectionId} disconnected`);
            this.connectionTracker.RemoveSpectator(this.ConnectionId);
        };
    };
}
