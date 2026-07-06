import ws from "ws";
import { AbstractSocketHandler } from "./AbstractSocketHandler";
import { AgentPacket, GameRole } from "@coderone/bomberland-library";
import { ConnectionTracker } from "../ConnectionTracker";
import { Telemetry } from "../Telemetry";
import { validatePacket } from "../../validatePacket";

export class AgentSocketHandler extends AbstractSocketHandler {
    public Role = GameRole.Agent;

    public constructor(
        private telemetry: Telemetry,
        private connection: ws.Server,
        public ConnectionId: number,
        protected name: string,
        private agentId: string,
        public AgentId: string,
        private connectionTracker: ConnectionTracker,
        private onConnection?: (connection: AbstractSocketHandler) => void,
        private onAgentAction?: (packet: AgentPacket, agentId: string) => void
    ) {
        super();
        this.instantiateSocketHandler();
    }

    protected instantiateSocketHandler = () => {
        this.connection.on("message", (message: string) => {
            this.onMessage(message);
        });
        this.connection.on("close", this.onClose());
        this.connection.on("error", (error: Error) => {
            this.telemetry.Error(`Agent socket error [${this.name}](${this.AgentId}): ${error.message}`);
        });
        this.onConnection?.(this);
        this.telemetry.Info(`Agent [${this.name}](${this.agentId}) connected to the server`);
    };

    private onMessage = (rawMessage: string) => {
        try {
            const gameEventType = JSON.parse(rawMessage);
            if (validatePacket(this.telemetry, gameEventType, "#/definitions/ValidAgentPacket")) {
                this.onAgentAction?.(gameEventType, this.AgentId);
            }
        } catch (e) {
            this.telemetry.Error(`Invalid event recieved:`);
            this.telemetry.Error(rawMessage);
        }
    };

    public Send = (message: string) => {
        const socket = this.connection as ws.Server & { send: (message: string) => void; readyState: number };
        if (socket.readyState !== ws.OPEN) {
            return;
        }
        try {
            socket.send(message);
        } catch (error) {
            this.telemetry.Error(`Failed to send to agent ${this.AgentId}: ${error}`);
        }
    };

    private onClose = () => {
        return () => {
            this.telemetry.Info(`Client ${this.Role} ${this.name} disconnected`);
            this.connectionTracker.RemoveAgent(this.AgentId);
        };
    };
}
