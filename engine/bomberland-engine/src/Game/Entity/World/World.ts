import { AbstractEntity } from "../AbstractEntity";
import { Unit } from "../../Unit/Unit";
import { AmmoEntity } from "../AmmoEntity";
import { BlastEntity } from "../BlastEntity";
import { BlastPowerupEntity } from "../BlastPowerupEntity";
import { BombEntity } from "../BombEntity";
import { BooleanDie } from "../../Probability/BooleanDie";
import { CellReserver } from "./CellReserver";
import { EmptyCellTracker } from "./EmptyCellTracker";
import { GameTicker } from "../../Game/GameTicker";
import { PRNG } from "../../Probability/Probability.types";
import { Telemetry } from "../../../Services/Telemetry";
import { WeightedDie } from "../../Probability/WeightedDie";
import {
    EntityType,
    GameEvent,
    GameEventType,
    getCellNumberFromCoordinates,
    getCoordinatesFromCellNumber,
    IAgentStateEvent,
    IEntity,
    IEntityExpiredEvent,
    IEntitySpawnedEvent,
    IEntityStateEvent,
    IUnitState,
} from "@coderone/bomberland-library";
import { IConfig } from "../../../Config/IConfig";

export interface IWorldState {
    readonly units: Array<IUnitState>;
    readonly entities: Array<IEntity>;
}

// TODO: move agent actions and spawn methods to separate class that accepts a world in constructor as this class is too big
export class World {
    private agentCellNumbers = new Set<number>();
    private worldTickEvents: Array<GameEvent> = [];
    private shouldSpawnBooleanDie: BooleanDie;
    private spawnWeightedDie: WeightedDie<EntityType>;

    public constructor(
        private telemetry: Telemetry,
        private config: IConfig,
        prngGame: PRNG,
        private cellReserver: CellReserver,
        private emptyCellTracker: EmptyCellTracker,
        public UnitMap: Map<string, Unit>,
        private entities: Map<number, AbstractEntity>,
        private gameTicker: GameTicker,
        public readonly Width: number,
        public readonly Height: number
    ) {
        this.shouldSpawnBooleanDie = new BooleanDie(this.config.EntitySpawnProbabilityPerTick, prngGame);

        this.spawnWeightedDie = new WeightedDie<EntityType>(
            [
                { weighting: this.config.AmmoSpawnWeighting, value: EntityType.Ammo },
                { weighting: this.config.BlastPowerupSpawnWeighting, value: EntityType.BlastPowerup },
            ],
            prngGame
        );

        if (this.agentCellNumbers.size <= 0) {
            this.UnitMap.forEach((agent) => {
                this.agentCellNumbers.add(agent.CellNumber);
            });
        }
    }

    public get WorldState(): IWorldState {
        return {
            units: Array.from(this.UnitMap.values()).map((agent) => agent.State),
            entities: Array.from(this.entities.values()).map((entity) => entity.ToJSON()),
        };
    }

    public GetUnit = (unitId: string): Unit => {
        const agent = this.UnitMap.get(unitId);
        if (agent === undefined) {
            throw Error(`UnitId ${unitId} not found in unitMap: ${Array.from(this.UnitMap.keys())}.`);
        }
        return agent;
    };

    public IsCoordinateVacant = (x: number, y: number): boolean => {
        const isWithinHorizontalBounds = x >= 0 && x < this.Width;
        const isWithinVerticalBounds = y >= 0 && y < this.Height;

        if (isWithinHorizontalBounds === false || isWithinVerticalBounds === false) {
            return false;
        }
        const cellNumber = getCellNumberFromCoordinates([x, y], this.Width);
        const entity = this.entities.get(cellNumber);
        if (entity?.CanAgentMoveHere === false) {
            return false;
        }
        return true;
    };

    public OnUnitMove = (oldCoordinates: [number, number], newCoordinates: [number, number]) => {
        const oldCellNumber = getCellNumberFromCoordinates(oldCoordinates, this.Width);
        const newCellNumber = getCellNumberFromCoordinates(newCoordinates, this.Width);
        this.agentCellNumbers.delete(oldCellNumber);
        this.agentCellNumbers.add(newCellNumber);
    };

    public PlaceBomb = (cellNumber: number, unitId: string) => {
        const unit = this.UnitMap.get(unitId);
        const [x, y] = getCoordinatesFromCellNumber(cellNumber, this.Width);
        if (unit !== undefined && this.IsCoordinateVacant(x, y)) {
            const agentId = unit.AgentId;
            const bomb = new BombEntity(
                this.config,
                cellNumber,
                this.Width,
                unitId,
                agentId,
                this.gameTicker.CurrentTick,
                unit.BlastDiameter
            );
            this.cellReserver.ReserveAvailableCellNumber(cellNumber);
            this.PlaceEntity(bomb);
            unit.DecreaseBombCount();
            this.pushAgentState(unit);
        }
    };

    public GetEntityInCell = (cellNumber: number): AbstractEntity | undefined => {
        return this.entities.get(cellNumber);
    };

    public Tick = (): Array<GameEvent> => {
        this.expireEntities();
        this.checkAgentEntityCollision();
        this.randomSpawn();
        const events = [...this.worldTickEvents];
        this.worldTickEvents = [];
        return events;
    };

    public FlushWorldTickEventBuffer = (): Array<GameEvent> => {
        const events = [...this.worldTickEvents];
        this.worldTickEvents = [];
        return events;
    };

    public DoesCoordinateContainAgent = (coordinates: [number, number]) => {
        return this.WorldState.units.some((agent) => {
            const [x, y] = agent.coordinates;
            const [newX, newY] = coordinates;
            return x === newX && y === newY;
        });
    };

    private randomSpawn = () => {
        const shouldSpawnEntity = this.shouldSpawnBooleanDie.Roll();
        if (shouldSpawnEntity === true) {
            const entityType = this.spawnWeightedDie.Roll();
            const randomUnassignedCellNumber = this.emptyCellTracker.ReserveRandomEmptyCell(this.agentCellNumbers);
            if (randomUnassignedCellNumber !== undefined) {
                if (entityType === EntityType.BlastPowerup) {
                    this.onBlastPowerupSpawned(randomUnassignedCellNumber);
                } else if (entityType === EntityType.Ammo) {
                    this.onAmmoSpawned(randomUnassignedCellNumber);
                } else {
                    this.telemetry.Warning(`Unhandled entity type: ${entityType}`);
                }
            }
        }
    };

    private onBlastPowerupSpawned = (cellNumber: number) => {
        const blastPowerup = new BlastPowerupEntity(this.config, cellNumber, this.Width, this.gameTicker.CurrentTick);
        this.PlaceEntity(blastPowerup);
    };

    private onAmmoSpawned = (cellNumber: number) => {
        const ammo = new AmmoEntity(this.config, cellNumber, this.Width, this.gameTicker.CurrentTick);
        this.PlaceEntity(ammo);
    };

    private expireEntities = () => {
        this.entities.forEach((entity, _key) => {
            if (entity.Expires !== undefined && entity.Expires <= this.gameTicker.CurrentTick) {
                this.ExpireEntity(entity);
            }
        });
        return this.worldTickEvents;
    };

    public ExpireEntityInCell = (cellNumber: number) => {
        const entity = this.GetEntityInCell(cellNumber);
        if (entity !== undefined) {
            this.ExpireEntity(entity);
        }
    };

    public ExpireEntity = (entity: AbstractEntity) => {
        this.telemetry.Info(`${JSON.stringify(entity.ToJSON())} has expired`);
        const coordinates = getCoordinatesFromCellNumber(entity.CellNumber, this.Width);
        this.RemoveEntity(entity.CellNumber);
        if (entity.Type === EntityType.Bomb) {
            const bomb = entity as BombEntity;
            this.CreateBlastFromOrigin(coordinates, bomb.BlastDiameter, entity.UnitId);
        }
    };

    private checkAgentEntityCollision = () => {
        this.entities.forEach((entity) => {
            if (entity.Type === EntityType.Blast) {
                const blast = entity as BlastEntity;
                const cell = blast.CellNumber;
                if (this.agentCellNumbers.has(cell)) {
                    this.UnitMap.forEach((agent) => {
                        if (agent.CellNumber === cell) {
                            this.reduceAgentHealth(agent);
                        }
                    });
                }
            }
            if (entity.Type === EntityType.Ammo) {
                const cell = entity.CellNumber;
                if (this.agentCellNumbers.has(cell)) {
                    this.UnitMap.forEach((agent) => {
                        if (agent.CellNumber === cell) {
                            this.increaseAgentAmmo(agent);
                            this.RemoveEntity(cell);
                        }
                    });
                }
            }
            if (entity.Type === EntityType.BlastPowerup) {
                const cell = entity.CellNumber;
                if (this.agentCellNumbers.has(cell)) {
                    this.UnitMap.forEach((agent) => {
                        if (agent.CellNumber === cell) {
                            this.increaseAgentBlast(agent);
                            this.RemoveEntity(cell);
                        }
                    });
                }
            }
        });
    };

    public CreateBlastFromOrigin = (cellOriginCoordinates: [number, number], blastDiameter: number, unitId: string | undefined) => {
        this.telemetry.Info(`Triggering blast from ${cellOriginCoordinates}`);
        const blastRadius = (blastDiameter - 1) / 2;
        const originCellNumber = getCellNumberFromCoordinates(cellOriginCoordinates, this.Width);

        // origin
        this.generateBlastInCell(originCellNumber, unitId);

        // up
        this.verticalBlast(cellOriginCoordinates, blastRadius, unitId);
        // down
        this.verticalBlast(cellOriginCoordinates, -blastRadius, unitId);
        // left
        this.horizontalBlast(cellOriginCoordinates, -blastRadius, unitId);
        // right
        this.horizontalBlast(cellOriginCoordinates, blastRadius, unitId);
    };

    private horizontalBlast = (origin: [number, number], offset: number, unitId: string | undefined) => {
        if (offset > 0) {
            for (let i = 0; i < offset; i++) {
                const [x, y] = origin;
                const coordinates: [number, number] = [x + i + 1, y];
                if (this.areCoordinatesValid(coordinates)) {
                    const cellNumber = getCellNumberFromCoordinates(coordinates, this.Width);
                    const blast = this.generateBlastInCell(cellNumber, unitId);
                    if (blast === undefined) {
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < Math.abs(offset); i++) {
                const [x, y] = origin;
                const coordinates: [number, number] = [x - i - 1, y];
                if (this.areCoordinatesValid(coordinates)) {
                    const cellNumber = getCellNumberFromCoordinates(coordinates, this.Width);
                    const blast = this.generateBlastInCell(cellNumber, unitId);
                    if (blast === undefined) {
                        break;
                    }
                }
            }
        }
    };

    private verticalBlast = (origin: [number, number], offset: number, unitId: string | undefined) => {
        if (offset > 0) {
            for (let i = 0; i < offset; i++) {
                const [x, y] = origin;
                const coordinates: [number, number] = [x, y + i + 1];
                if (this.areCoordinatesValid(coordinates)) {
                    const cellNumber = getCellNumberFromCoordinates(coordinates, this.Width);
                    const blast = this.generateBlastInCell(cellNumber, unitId);
                    if (blast === undefined) {
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < Math.abs(offset); i++) {
                const [x, y] = origin;
                const coordinates: [number, number] = [x, y - i - 1];
                if (this.areCoordinatesValid(coordinates)) {
                    const cellNumber = getCellNumberFromCoordinates(coordinates, this.Width);
                    const blast = this.generateBlastInCell(cellNumber, unitId);
                    if (blast === undefined) {
                        break;
                    }
                }
            }
        }
    };

    private generateBlastInCell = (cellNumber: number, unitId: string | undefined): BlastEntity | undefined => {
        const entity = this.entities.get(cellNumber);
        const isAgentInCell = this.agentCellNumbers.has(cellNumber);
        const agentId = this.getAgentIdFromUnitId(unitId);

        if (isAgentInCell) {
            this.UnitMap.forEach((agent) => {
                if (agent.CellNumber === cellNumber) {
                    this.reduceAgentHealth(agent);
                }
            });
        }
        if (entity === undefined) {
            const blast = new BlastEntity(
                this.config,
                cellNumber,
                unitId,
                agentId,
                this.gameTicker.CurrentTick + this.config.BlastDurationTicks,
                this.gameTicker.CurrentTick
            );
            this.PlaceEntity(blast);
            this.cellReserver.ReserveAvailableCellNumber(cellNumber);
            return blast;
        } else if (entity.Type === EntityType.Blast) {
            const blastExpiry = entity.Expires !== undefined ? this.gameTicker.CurrentTick + this.config.BlastDurationTicks : undefined;
            const blast = new BlastEntity(this.config, cellNumber, unitId, agentId, blastExpiry, this.gameTicker.CurrentTick);
            this.ExpireEntity(entity);
            this.PlaceEntity(blast);
            return blast;
        } else {
            const entityCoordinates = entity.Coordinates;
            const remainingHealth = entity.ReduceHealth();
            if (remainingHealth !== undefined) {
                const entityStateEvent: IEntityStateEvent = {
                    type: GameEventType.EntityState,
                    coordinates: entityCoordinates,
                    updated_entity: entity.ToJSON(),
                };
                this.worldTickEvents.push(entityStateEvent);
            }
            if (remainingHealth !== undefined && remainingHealth <= 0) {
                this.RemoveEntity(cellNumber);
                if (entity.Type === EntityType.Bomb) {
                    const bomb = entity as BombEntity;
                    this.CreateBlastFromOrigin(getCoordinatesFromCellNumber(bomb.CellNumber, this.Width), bomb.BlastDiameter, bomb.UnitId);
                }
            }
        }
    };

    private areCoordinatesValid = (coordinates: [number, number]): boolean => {
        const [x, y] = coordinates;
        if (x >= 0 && x < this.Width && y < this.Height && y >= 0) {
            return true;
        }
        return false;
    };

    public RemoveEntity = (cellNumber: number) => {
        if (this.entities.has(cellNumber)) {
            this.entities.delete(cellNumber);
            const expiryEvent: IEntityExpiredEvent = {
                type: GameEventType.EntityExpired,
                data: getCoordinatesFromCellNumber(cellNumber, this.Width),
            };
            this.cellReserver.FreeCell(cellNumber);
            this.worldTickEvents.push(expiryEvent);
        }
    };

    public PlaceEntity = (entity: AbstractEntity) => {
        const cellNumber = entity.CellNumber;
        this.entities.set(cellNumber, entity);
        this.cellReserver.ReserveAvailableCellNumber(cellNumber);
        const spawnEvent: IEntitySpawnedEvent = {
            type: GameEventType.EntitySpawned,
            data: entity.ToJSON(),
        };
        this.worldTickEvents.push(spawnEvent);
    };

    private pushAgentState = (agent: Unit) => {
        const agentState: IAgentStateEvent = {
            type: GameEventType.UnitState,
            data: agent.State,
        };
        this.worldTickEvents.push(agentState);
    };

    private reduceAgentHealth = (agent: Unit) => {
        if (agent.Invulnerability < this.gameTicker.CurrentTick) {
            agent.ReduceHealth(this.gameTicker.CurrentTick);
            this.pushAgentState(agent);
        }
    };

    private increaseAgentAmmo = (agent: Unit) => {
        agent.IncreaseAmmo();
        this.pushAgentState(agent);
    };

    private increaseAgentBlast = (agent: Unit) => {
        agent.IncreaseBlast();
        this.pushAgentState(agent);
    };

    private getAgentIdFromUnitId = (unitId: string | undefined) => {
        const unit = this.UnitMap.get(unitId ?? "");
        return unit?.AgentId;
    };
}
