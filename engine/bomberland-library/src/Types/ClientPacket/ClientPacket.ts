import { AdminPacket } from "./AdminPacket";
import { AgentPacket } from "./AgentPacket";

export type IClientPacket = AdminPacket | AgentPacket;
