import { GameRole } from "@coderone/bomberland-library";

export abstract class AbstractSocketHandler {
    public abstract AgentId: string | null;
    public abstract Role: GameRole;
    protected abstract instantiateSocketHandler: () => void;
    public abstract ConnectionId: number;
    public abstract Send: (message: string) => void;

    protected constructor() {}
}
