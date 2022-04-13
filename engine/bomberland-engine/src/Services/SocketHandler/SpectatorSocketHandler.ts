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
        this.onConnection?.(this);
        this.telemetry.Info(`Spectator (${this.ConnectionId}) connected to the server`);
    };

    public Send = (message: string) => {
        (this.connection as ws.Server & { send: (message: string) => void }).send(message);
    };

    private onClose = () => {
        return () => {
            this.telemetry.Info(`Spectator ${this.ConnectionId} disconnected`);
            this.connectionTracker.RemoveSpectator(this.ConnectionId);
        };
    };
}
