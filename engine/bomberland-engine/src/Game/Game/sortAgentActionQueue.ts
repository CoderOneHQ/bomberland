import { AgentPacket, PacketType } from "@coderone/bomberland-library";

/**
 * Sort order:
 * 1. PacketType.Bomb
 * 2. PacketType.Detonate
 * 3. PacketType.Move
 */
const orderMapping = new Map<PacketType, number>([
    [PacketType.Bomb, 0],
    [PacketType.Detonate, 1],
    [PacketType.Move, 2],
]);

const sortFn = (a: [string, AgentPacket], b: [string, AgentPacket]) => {
    const [, packetA] = a;
    const [, packetB] = b;
    const orderValueA = orderMapping.get(packetA.type);
    const orderValueB = orderMapping.get(packetB.type);

    if (orderValueA === undefined || orderValueB === undefined) {
        throw new Error(`Unhandled packet type(s) recieved for comparison: [${packetA.type}, ${packetB.type}]`);
    }

    if (orderValueA < orderValueB) {
        return -1;
    }
    if (orderValueA > orderValueB) {
        return 1;
    }
    return 0;
};

export const sortAgentActionQueue = (queue: Array<[string, AgentPacket]>) => {
    queue.sort(sortFn);
};
