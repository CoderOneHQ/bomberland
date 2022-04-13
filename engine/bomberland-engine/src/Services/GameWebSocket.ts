import express from "express";
import ws from "ws";
import http from "http";
import { AbstractSocketHandler } from "./SocketHandler/AbstractSocketHandler";
import { AdminPacket, AgentPacket, ServerPacket } from "@coderone/bomberland-library";
import { AdminSocketHandler } from "./SocketHandler/AdminSocketHandler";
import { attachSocketHandler, ISocketOptions } from "./SocketHandler/attachSocketHandler";
import { ConnectionTracker } from "./ConnectionTracker";
import { IncomingMessage } from "http";
import { Telemetry } from "./Telemetry";
import { Socket } from "net";
import { IConfig } from "../Config/IConfig";

export class GameWebsocket {
    private connectionIdCounter = 0;
    private app: express.Express;
    private wss: ws.Server;
    private onConnectionSuccess?: (connection: AbstractSocketHandler) => void;
    private onAdminAction?: (adminPayload: AdminPacket, connection: AdminSocketHandler) => void;
    private onAgentAction?: (packet: AgentPacket, agentId: string) => void;
    public constructor(
        private telemetry: Telemetry,
        private config: IConfig,
        private connectionTracker: ConnectionTracker,
        private port: number
    ) {
        this.app = express();
        this.wss = new ws.Server({ noServer: true });
        this.configure();
    }

    private configure = () => {
        this.wss.on("connection", this.onConnection);

        const server = http.createServer(this.app);
        server.on("upgrade", (request, socket, head) => {
            this.wss.handleUpgrade(request, socket as Socket, head, (socket) => {
                this.wss.emit("connection", socket, request);
            });
        });
        server.listen(this.port);
    };

    private onConnection = (connection: ws.Server, request: IncomingMessage) => {
        const pathString = request?.url || "";
        const searchParams = new URLSearchParams(pathString.charAt(0) === "/" ? pathString.substr(1) : pathString);
        // TODO: validation / sanitise
        const name = searchParams.get("name");
        const role = searchParams.get("role");
        const agentId = searchParams.get("agentId");
        const connectionId = ++this.connectionIdCounter;

        const socketOptions: ISocketOptions = { name, role, agentSecret: agentId };

        if (role !== null) {
            try {
                attachSocketHandler(
                    this.telemetry,
                    this.config,
                    connection,
                    this.connectionTracker,
                    connectionId,
                    socketOptions,
                    this.onConnectionSuccess,
                    this.onAdminAction,
                    this.onAgentAction
                );
            } catch (e) {
                this.telemetry.Error(`Unable to connect socket with error: ${e}`);
            }
        } else {
            this.telemetry.Error(`Client tried to connect with invalid query params: ${request.url}`);
            connection.close();
        }
    };

    public BroadCast = (packet: ServerPacket) => {
        const output = JSON.stringify(packet);
        this.connectionTracker.Connections.forEach((value) => {
            value.Send(output);
        });
    };

    public RegisterConnectionSuccessCallback = (onConnectionSuccess: (connection: AbstractSocketHandler) => void) => {
        this.onConnectionSuccess = onConnectionSuccess;
    };

    public RegisterAdminActionCallback = (onAdminAction: (adminPayload: AdminPacket, connection: AdminSocketHandler) => void) => {
        this.onAdminAction = onAdminAction;
    };

    public RegisterAgentActionCallback = (onAgentAction: (packet: AgentPacket, agentId: string) => void) => {
        this.onAgentAction = onAgentAction;
    };
}
