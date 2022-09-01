import { EntityType } from "@coderone/bomberland-library";
import { AbstractEntity } from "../AbstractEntity";

export class EntityTracker {
    private entities = new Map<number, AbstractEntity>();
    private activeBombsByAgent = new Map<string, Set<number>>();
    public get Entities() {
        return Array.from(this.entities.values());
    }
    public constructor() {}

    public Add = (entity: AbstractEntity) => {
        this.entities.set(entity.CellNumber, entity);
        if (entity.Type === EntityType.Bomb && entity.AgentId !== undefined) {
            const bombSet = this.activeBombsByAgent.get(entity.AgentId) ?? new Set<number>();
            bombSet.add(entity.CellNumber);
            this.activeBombsByAgent.set(entity.AgentId, bombSet);
        }
    };

    public Get = (cellNumber: number) => {
        return this.entities.get(cellNumber);
    };

    public IsOccupied = (cellNumber: number) => {
        return this.entities.has(cellNumber);
    };

    public Remove = (cellNumber: number) => {
        const entity = this.entities.get(cellNumber);
        if (entity === undefined) {
            return;
        }
        if (entity.Type === EntityType.Bomb && entity.AgentId !== undefined) {
            const bombSet = this.activeBombsByAgent.get(entity.AgentId) ?? new Set<number>();
            bombSet.delete(entity.CellNumber);
        }
        this.entities.delete(cellNumber);
    };

    public ActiveBombCountByAgent = (agentId: string) => {
        const agentBombSet = this.activeBombsByAgent.get(agentId);

        return agentBombSet?.size ?? 0;
    };
}
