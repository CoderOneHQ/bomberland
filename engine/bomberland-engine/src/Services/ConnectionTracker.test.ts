import { AbstractSocketHandler } from "./SocketHandler/AbstractSocketHandler";
import { AdminSocketHandler } from "./SocketHandler/AdminSocketHandler";
import { AgentSocketHandler } from "./SocketHandler/AgentSocketHandler";
import { ConnectionTracker } from "./ConnectionTracker";
import { GameRole } from "@coderone/bomberland-library";
import { SpectatorSocketHandler } from "./SocketHandler/SpectatorSocketHandler";

// Minimal fakes: ConnectionTracker only reads ConnectionId / AgentId / Role and stores
// the handlers, so we avoid instantiating real socket handlers (which open ws listeners).
const makeAgent = (connectionId: number, agentId: string): AgentSocketHandler =>
    ({ ConnectionId: connectionId, AgentId: agentId, Role: GameRole.Agent } as unknown as AgentSocketHandler);

const makeSpectator = (connectionId: number): SpectatorSocketHandler =>
    ({ ConnectionId: connectionId, AgentId: null, Role: GameRole.Spectator } as unknown as SpectatorSocketHandler);

const makeAdmin = (connectionId: number): AdminSocketHandler =>
    ({ ConnectionId: connectionId, AgentId: null, Role: GameRole.Admin } as unknown as AdminSocketHandler);

const connectionIds = (tracker: ConnectionTracker): Array<number> => tracker.Connections.map((c) => c.ConnectionId);

describe("ConnectionTracker", () => {
    test("tracks total agents as agents connect and disconnect", () => {
        const tracker = new ConnectionTracker();
        tracker.AddAgent(makeAgent(1, "a"));
        tracker.AddAgent(makeAgent(2, "b"));
        expect(tracker.TotalAgents).toStrictEqual(2);
        expect(tracker.IsAgentConnected("a")).toStrictEqual(true);

        tracker.RemoveAgent("a");
        expect(tracker.TotalAgents).toStrictEqual(1);
        expect(tracker.IsAgentConnected("a")).toStrictEqual(false);
        expect(tracker.IsAgentConnected("b")).toStrictEqual(true);
    });

    test("removes the correct connection when multiple are connected", () => {
        const tracker = new ConnectionTracker();
        tracker.AddSpectator(makeSpectator(1));
        tracker.AddSpectator(makeSpectator(2));
        tracker.AddSpectator(makeSpectator(3));

        tracker.RemoveSpectator(2);

        // Only spectator 2 should be gone; 1 and 3 must remain.
        const remaining = connectionIds(tracker).sort((a, b) => a - b);
        expect(remaining).toStrictEqual([1, 3]);
    });

    test("keeps the connection list consistent across interleaved add/remove", () => {
        const tracker = new ConnectionTracker();
        tracker.AddAgent(makeAgent(1, "a"));
        tracker.AddSpectator(makeSpectator(2));
        tracker.AddAdmin(makeAdmin(3));
        tracker.AddSpectator(makeSpectator(4));

        // Sorting on add (agent > admin > spectator) must not corrupt later removals.
        tracker.RemoveSpectator(2);
        tracker.RemoveAgent("a");

        const remaining = connectionIds(tracker).sort((a, b) => a - b);
        expect(remaining).toStrictEqual([3, 4]);
        expect(tracker.TotalAgents).toStrictEqual(0);
    });

    test("orders connections by role weighting (agent, then admin, then spectator)", () => {
        const tracker = new ConnectionTracker();
        tracker.AddSpectator(makeSpectator(1));
        tracker.AddAdmin(makeAdmin(2));
        tracker.AddAgent(makeAgent(3, "a"));

        const roles = tracker.Connections.map((c: AbstractSocketHandler) => c.Role);
        expect(roles).toStrictEqual([GameRole.Agent, GameRole.Admin, GameRole.Spectator]);
    });

    test("ignores removal of an unknown connection id", () => {
        const tracker = new ConnectionTracker();
        tracker.AddSpectator(makeSpectator(1));

        tracker.RemoveSpectator(999);

        expect(connectionIds(tracker)).toStrictEqual([1]);
    });
});
