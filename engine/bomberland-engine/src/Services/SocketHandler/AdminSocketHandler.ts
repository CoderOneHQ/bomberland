import ws from "ws";
import { AbstractSocketHandler } from "./AbstractSocketHandler";
import { AdminPacket, GameRole } from "@coderone/bomberland-library";
import { ConnectionTracker } from "../ConnectionTracker";
import { Telemetry } from "../Telemetry";
import { validatePacket } from "../../validatePacket";

export class AdminSocketHandler extends AbstractSocketHandler {
    public AgentId = null;
    public Role = GameRole.Admin;

    public constructor(
        private telemetry: Telemetry,
        private connection: ws.Server,
        public ConnectionId: number,
        private connectionTracker: ConnectionTracker,
        private onConnection?: (connection: AbstractSocketHandler) => void,
        private onAdminAction?: (adminPayload: AdminPacket, connection: AdminSocketHandler) => void
    ) {
        super();
        this.instantiateSocketHandler();
    }

    protected instantiateSocketHandler = () => {
        this.connection.on("message", (message: string) => {
            this.onMessage(message);
        });
        this.connection.on("close", this.onClose());
        this.onConnection?.(this);
        this.telemetry.Info(`Admin [${this.ConnectionId}] connected to the server`);
    };

    private onMessage = (rawMessage: string) => {
        try {
            const packet = JSON.parse(rawMessage);
            if (validatePacket(this.telemetry, packet, "#/definitions/ValidAdminPacket")) {
                this.telemetry.Info(`Admin packet received: ${rawMessage}`);
                this.onAdminAction?.(packet, this);
            }
        } catch (e) {
            this.telemetry.Error(`Invalid event recieved:`);
            this.telemetry.Error(rawMessage);
        }
    };

    public Send = (message: string) => {
        (this.connection as ws.Server & { send: (message: string) => void }).send(message);
    };

    private onClose = () => {
        return () => {
            this.telemetry.Info(`Admin disconnected`);
            this.connectionTracker.RemoveAdmin(this.ConnectionId);
        };
    };
}
