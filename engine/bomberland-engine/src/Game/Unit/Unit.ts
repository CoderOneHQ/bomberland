import { getCellNumberFromCoordinates, IUnitState } from "@coderone/bomberland-library";
import { IConfig } from "../../Config/IConfig";

export class Unit {
    public get BlastDiameter(): number {
        return this.blastDiameter;
    }
    public get Invulnerability(): number {
        return this.invulnerability;
    }
    public get State(): IUnitState {
        return {
            coordinates: [...this.coordinates],
            hp: this.HP,
            inventory: {
                bombs: this.bombs,
            },
            blast_diameter: this.blastDiameter,
            unit_id: this.UnitId,
            agent_id: this.AgentId,
            invulnerability: this.invulnerability,
        };
    }

    public get CellNumber(): number {
        return getCellNumberFromCoordinates(this.coordinates, this.mapWidth);
    }

    public get Coordinates(): [number, number] {
        return [...this.coordinates];
    }

    public constructor(
        private config: IConfig,
        private coordinates: [number, number],
        private mapWidth: number,
        public AgentId: string,
        public UnitId: string,
        private bombs: number,
        public HP: number,
        private blastDiameter: number,
        private invulnerability: number
    ) {}

    public SetCoordinates = (x: number, y: number): void => {
        const newCoordinates: [number, number] = [x, y];
        this.coordinates = newCoordinates;
    };

    public DecreaseBombCount = () => {
        this.bombs--;
    };

    public ReduceHealth = (currentTick: number): number => {
        this.HP--;
        this.invulnerability = currentTick + this.config.InvunerabilityTicks;
        return this.HP;
    };

    public IncreaseAmmo = (): number => {
        this.bombs++;
        return this.bombs;
    };

    public IncreaseBlast = (): number => {
        this.blastDiameter += 2;
        return this.blastDiameter;
    };
}
