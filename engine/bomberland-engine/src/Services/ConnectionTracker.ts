import { AbstractSocketHandler } from "./SocketHandler/AbstractSocketHandler";
import { AdminSocketHandler } from "./SocketHandler/AdminSocketHandler";
import { AgentSocketHandler } from "./SocketHandler/AgentSocketHandler";
import { GameRole } from "@coderone/bomberland-library";
import { SpectatorSocketHandler } from "./SocketHandler/SpectatorSocketHandler";

const getRoleWeighting = (role: GameRole): number => {
    if (role === GameRole.Agent) {
        return 2;
    } else if (role === GameRole.Admin) {
        return 1;
    }
    return 0;
};

const connectionSortComparatorFn = (a: AbstractSocketHandler, b: AbstractSocketHandler) => {
    return getRoleWeighting(b.Role) - getRoleWeighting(a.Role);
};

export class ConnectionTracker {
    private readonly adminSockets = new Map<number, AdminSocketHandler>();
    private readonly agentSockets = new Map<string, AgentSocketHandler>();
    private readonly spectators = new Map<number, SpectatorSocketHandler>();
    private readonly connections: Array<AbstractSocketHandler> = [];
    private readonly connectionNumberIndexMap = new Map<number, number>();

    public get Connections(): Array<AbstractSocketHandler> {
        return this.connections;
    }

    public get TotalAgents(): number {
        return this.agentSockets.size;
    }

    public IsAgentConnected = (agentId: string): boolean => {
        return this.agentSockets.has(agentId);
    };

    public AddAgent = (agentSocket: AgentSocketHandler) => {
        this.agentSockets.set(agentSocket.AgentId, agentSocket);
        this.addConnection(agentSocket);
    };

    public RemoveAgent = (agentId: string) => {
        const connection = this.agentSockets.get(agentId);
        if (connection) {
            this.agentSockets.delete(agentId);
            this.removeConnection(connection.ConnectionId);
        }
    };

    public AddSpectator = (spectator: SpectatorSocketHandler) => {
        this.spectators.set(spectator.ConnectionId, spectator);
        this.addConnection(spectator);
    };

    public RemoveSpectator = (connectionId: number) => {
        this.spectators.delete(connectionId);
        this.removeConnection(connectionId);
    };

    public AddAdmin = (admin: AdminSocketHandler) => {
        this.adminSockets.set(admin.ConnectionId, admin);
        this.addConnection(admin);
    };

    public RemoveAdmin = (connectionId: number) => {
        this.adminSockets.delete(connectionId);
        this.removeConnection(connectionId);
    };

    private addConnection = (connection: AbstractSocketHandler) => {
        this.connectionNumberIndexMap.set(connection.ConnectionId, this.connections.length);
        this.connections.push(connection);
        this.connections.sort(connectionSortComparatorFn);
    };

    private removeConnection = (connectionId: number) => {
        const index = this.connectionNumberIndexMap.get(connectionId);
        if (index !== undefined) {
            this.connections.splice(index, 1);
            this.connectionNumberIndexMap.delete(connectionId);
        }
    };
}
