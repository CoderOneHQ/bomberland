import { AgentBombPacket, AgentDetonatePacket, AgentMovePacket, AgentPacket, PacketType, UnitMove } from "@coderone/bomberland-library";
import { sortAgentActionQueue } from "./sortAgentActionQueue";

type Queue = Array<[string, AgentPacket]>;

const createMockAction = (
    agentId: string,
    unitId: string,
    packetType: PacketType.Bomb | PacketType.Detonate | PacketType.Move
): [string, AgentPacket] => {
    if (packetType === PacketType.Bomb) {
        const bombPacket: AgentBombPacket = {
            type: PacketType.Bomb,
            unit_id: unitId,
        };
        return [agentId, bombPacket];
    } else if (packetType === PacketType.Detonate) {
        const detonatePacket: AgentDetonatePacket = {
            type: PacketType.Detonate,
            coordinates: [0, 0],
            unit_id: unitId,
        };
        return [agentId, detonatePacket];
    } else {
        const movePacket: AgentMovePacket = {
            type: PacketType.Move,
            move: UnitMove.Up,
            unit_id: unitId,
        };
        return [agentId, movePacket];
    }
};

describe("sortAgentActionQueue", () => {
    test(`it should leave an empty queue unchanged`, () => {
        const queue: Queue = [];
        sortAgentActionQueue(queue);
        const result: Queue = [];
        expect(result).toStrictEqual(queue);
    });

    test(`it should leave a sorted queue unchanged`, () => {
        const queue: Queue = [
            createMockAction("a", "a", PacketType.Bomb),
            createMockAction("b", "b", PacketType.Detonate),
            createMockAction("c", "c", PacketType.Move),
        ];
        sortAgentActionQueue(queue);
        const result: Queue = [
            createMockAction("a", "a", PacketType.Bomb),
            createMockAction("b", "b", PacketType.Detonate),
            createMockAction("c", "c", PacketType.Move),
        ];
        expect(result).toStrictEqual(queue);
    });

    test(`it should sort un unsorted queue`, () => {
        const queue: Queue = [
            createMockAction("c", "c", PacketType.Move),
            createMockAction("b", "b", PacketType.Detonate),
            createMockAction("a", "a", PacketType.Bomb),
        ];
        sortAgentActionQueue(queue);
        const result: Queue = [
            createMockAction("a", "a", PacketType.Bomb),
            createMockAction("b", "b", PacketType.Detonate),
            createMockAction("c", "c", PacketType.Move),
        ];
        expect(result).toStrictEqual(queue);
    });
});
