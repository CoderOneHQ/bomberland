import ws from "ws";
import { AbstractSocketHandler } from "./AbstractSocketHandler";
import { AdminPacket, AgentPacket, GameRole } from "@coderone/bomberland-library";
import { AdminSocketHandler } from "./AdminSocketHandler";
import { AgentSocketHandler } from "./AgentSocketHandler";
import { ConnectionTracker } from "../ConnectionTracker";
import { SpectatorSocketHandler } from "./SpectatorSocketHandler";
import { Telemetry } from "../Telemetry";
import { IConfig } from "../../Config/IConfig";

export interface ISocketOptions {
    readonly name: string | null;
    readonly role: string | null;
    readonly agentSecret: string | null;
}

export const attachSocketHandler = (
    telemetry: Telemetry,
    config: IConfig,
    connection: ws.Server,
    connectionTracker: ConnectionTracker,
    id: number,
    socketOptions: ISocketOptions,
    onConnectionSuccess?: (connection: AbstractSocketHandler) => void,
    onAdminAction?: (adminPacket: AdminPacket, connection: AdminSocketHandler) => void,
    onAgentAction?: (packet: AgentPacket, agentId: string) => void
) => {
    const { role, name, agentSecret } = socketOptions;
    switch (role) {
        case GameRole.Admin:
            if (config.AdminRoleEnabled === false) {
                throw new Error("Admin role is currently disabled");
            }
            const admin = new AdminSocketHandler(telemetry, connection, id, connectionTracker, onConnectionSuccess, onAdminAction);
            connectionTracker.AddAdmin(admin);
            break;
        case GameRole.Agent:
            if (agentSecret === null) {
                throw new Error(`Invalid params for role ${GameRole.Agent}`);
            }

            const agentId = config.AgentSecretIdMap.get(agentSecret);
            if (agentId === undefined) {
                throw new Error(`Agent Id ${agentId} not found in agentMapping`);
            }
            const isAgentConnected = connectionTracker.IsAgentConnected(agentId);
            if (isAgentConnected === true) {
                throw new Error(`Agent ${agentId} is already connected`);
            }

            const agent = new AgentSocketHandler(
                telemetry,
                connection,
                id,
                name || "",
                agentId,
                agentId,
                connectionTracker,
                onConnectionSuccess,
                onAgentAction
            );
            connectionTracker.AddAgent(agent);

            break;
        case GameRole.Spectator:
            const spectator = new SpectatorSocketHandler(telemetry, connection, id, connectionTracker, onConnectionSuccess);
            connectionTracker.AddSpectator(spectator);
            break;
        default:
            telemetry.Error(`Unknown role ${role}`);
    }
};
