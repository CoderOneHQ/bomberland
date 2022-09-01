import { BlastEntity } from "../../BlastEntity";
import { BombEntity } from "../../BombEntity";
import { EntityType, GameEvent, getCoordinatesFromCellNumber } from "@coderone/bomberland-library";
import { GameTicker } from "../../../Game/GameTicker";
import { generateGrowingFireProgression } from "./generateGrowingFireProgression";
import { World } from "../World";
import { IConfig } from "../../../../Config/IConfig";

export class EndGameFireSpreader {
    private get cellToSpreadTo(): number | undefined {
        const { CurrentTick, GameDurationTicks } = this.gameTicker;
        if (CurrentTick < GameDurationTicks) {
            return undefined;
        }
        const delta = CurrentTick - GameDurationTicks;
        if (delta % this.fireSpawnIntervalTicks !== 0) {
            return undefined;
        }
        return this.fireProgression[delta / this.fireSpawnIntervalTicks];
    }

    private fireProgression: Array<number>;

    private reservedCells: Set<number> = new Set();

    public get ReservedCells(): ReadonlySet<number> {
        return this.reservedCells;
    }

    public constructor(
        private config: IConfig,
        private world: World,
        private gameTicker: GameTicker,
        private fireSpawnIntervalTicks: number
    ) {
        this.fireProgression = generateGrowingFireProgression(this.world.Width, this.world.Height);
    }

    public Spread = (): Array<GameEvent> => {
        const events: Array<GameEvent> = [];
        const cellNumber = this.cellToSpreadTo;
        if (cellNumber !== undefined) {
            this.reservedCells.add(cellNumber);
            const blast = new BlastEntity(this.config, cellNumber, undefined, undefined, undefined, this.gameTicker.CurrentTick);
            const entityInCell = this.world.EntityTracker.Get(cellNumber);
            this.world.RemoveEntity(cellNumber);
            if (entityInCell?.Type === EntityType.Bomb) {
                const bomb = entityInCell as BombEntity;
                const coordinates = getCoordinatesFromCellNumber(bomb.CellNumber, this.world.Width);
                this.world.CreateBlastFromOrigin(coordinates, bomb.BlastDiameter, bomb.UnitId);
            }
            this.world.PlaceEntity(blast);
        }
        return events;
    };
}
