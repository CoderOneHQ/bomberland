import { EntityType, getCoordinatesFromCellNumber, IEntity } from "@coderone/bomberland-library";
import { Telemetry } from "../../Services/Telemetry";

const noBlockEntitites = new Set<EntityType>([
    EntityType.Ammo,
    EntityType.TreasureChest,
    EntityType.Blast,
    EntityType.BlastPowerup,
    EntityType.FreezePowerup,
]);

export interface IInitialEntityValues {
    readonly cellNumber: number;
    readonly mapWidth: number;
    readonly type: EntityType;
    readonly expires: number | undefined;
    readonly created: number;
    hp: number | undefined;
    readonly unitId: string | undefined;
    readonly agentId: string | undefined;
    readonly blastDiameter: number | undefined;
}

export abstract class AbstractEntity {
    public get CanAgentMoveHere(): boolean {
        const isNotBlocked = noBlockEntitites.has(this.type);
        return isNotBlocked;
    }

    public get Expires(): number | undefined {
        return this.expires;
    }

    public get Type(): EntityType {
        return this.type;
    }

    public get CellNumber(): number {
        return this.cellNumber;
    }

    public get Coordinates(): [number, number] {
        return getCoordinatesFromCellNumber(this.cellNumber, this.mapWidth);
    }

    public get Created(): number {
        return this.created;
    }

    public get Hp(): number | undefined {
        return this.hp;
    }

    private readonly cellNumber: number;
    private readonly mapWidth: number;
    private readonly type: EntityType;
    private readonly expires: number | undefined;
    private readonly created: number;
    private hp: number | undefined;
    public readonly UnitId: string | undefined;
    public readonly AgentId: string | undefined;
    protected readonly blastDiameter: number | undefined;

    public constructor(private telemetry: Telemetry, intialValues: IInitialEntityValues) {
        const { cellNumber, mapWidth, type, expires, created, hp, unitId, agentId, blastDiameter } = intialValues;

        this.cellNumber = cellNumber;
        this.mapWidth = mapWidth;
        this.type = type;
        this.expires = expires;
        this.created = created;
        this.hp = hp;
        this.UnitId = unitId;
        this.AgentId = agentId;
        this.blastDiameter = blastDiameter;
    }

    public ToJSON = (): IEntity => {
        const [x, y] = getCoordinatesFromCellNumber(this.cellNumber, this.mapWidth);
        const { UnitId, type, expires, hp, blastDiameter, created, AgentId } = this;
        return {
            created,
            x,
            y,
            type,
            ...(UnitId !== undefined && { unit_id: UnitId }),
            ...(AgentId !== undefined && { agent_id: AgentId }),
            ...(expires !== undefined && { expires }),
            ...(hp !== undefined && { hp }),
            ...(blastDiameter !== undefined && { blast_diameter: blastDiameter }),
        };
    };

    public ReduceHealth = (): number | undefined => {
        if (this.hp !== undefined) {
            this.hp--;
            this.telemetry.Info(`${this.Type} at cell number ${this.CellNumber} has remaining health: ${this.hp}`);
        }
        return this.hp;
    };
}
