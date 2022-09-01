import { PRNG } from "./../../Probability/Probability.types";
import { Unit } from "./../../Unit/Unit";

export class UnitTracker {
    private unitMap: Map<string, Unit> = new Map();
    private agentUnitMap: Map<string, Map<string, Unit>> = new Map([
        ["a", new Map()],
        ["b", new Map()],
    ]);

    public get Size(): number {
        return this.unitMap.size;
    }
    public get Units(): Array<Unit> {
        return Array.from(this.unitMap.values());
    }

    public get UnitIds(): Array<string> {
        return Array.from(this.unitMap.keys());
    }

    public constructor(private prngGame: PRNG) {}

    public Set = (unit: Unit) => {
        this.unitMap.set(unit.UnitId, unit);
        const agentMap = this.agentUnitMap.get(unit.AgentId);

        if (agentMap === undefined) {
            return;
        }
        agentMap.set(unit.UnitId, unit);
    };

    public GetUnitById = (unitId: string) => {
        return this.unitMap.get(unitId);
    };

    public GetRandomAliveUnitByAgent = (agentId: string) => {
        const units = this.agentUnitMap.get(agentId);
        if (units === undefined) {
            return null;
        }
        const aliveUnits = Array.from(units.values()).filter((unit) => {
            return unit.HP > 0;
        });
        if (aliveUnits.length === 0) {
            return null;
        }
        const randomIndex = Math.floor(this.prngGame() * aliveUnits.length);
        return aliveUnits[randomIndex] ?? null;
    };
}
