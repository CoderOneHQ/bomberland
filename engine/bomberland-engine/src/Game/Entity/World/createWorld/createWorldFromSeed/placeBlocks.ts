import { AbstractEntity } from "../../../AbstractEntity";
import { createBlockEntity } from "../../../createBlockEntity";
import { EmptyCellTracker } from "../../EmptyCellTracker";
import { EntityType } from "@coderone/bomberland-library";
import { IConfig } from "../../../../../Config/IConfig";

const placeBlock = (
    config: IConfig,
    entities: Map<number, AbstractEntity>,
    cellNumber: number,
    mapWidth: number,
    type: EntityType,
    currentTick: number
) => {
    const entity = createBlockEntity(config, cellNumber, mapWidth, type, undefined, undefined, currentTick);
    entities.set(cellNumber, entity);
};

export const placeBlocks = (
    config: IConfig,
    mapWidth: number,
    isSymmetricalMap: boolean,
    emptyCellTracker: EmptyCellTracker,
    entities: Map<number, AbstractEntity>,
    numberBlocksToPlace: number,
    type: EntityType,
    currentTick: number
) => {
    if (isSymmetricalMap) {
        const isNumberOfBlocksEven = numberBlocksToPlace % 2 === 0;
        const evenNumberOfBlocksToPlace = isNumberOfBlocksEven ? numberBlocksToPlace : numberBlocksToPlace + 1;
        const pairsToPlace = evenNumberOfBlocksToPlace / 2;
        for (let i = 0; i < pairsToPlace; i++) {
            const cells = emptyCellTracker.ReserveRandomReflectedCells();
            if (cells !== undefined) {
                const [cellA, cellB] = cells;
                placeBlock(config, entities, cellA, mapWidth, type, currentTick);
                placeBlock(config, entities, cellB, mapWidth, type, currentTick);
            }
        }
    } else {
        for (let i = 0; i < numberBlocksToPlace; i++) {
            const randomUnassignedCellNumber = emptyCellTracker.ReserveRandomEmptyCell();
            if (randomUnassignedCellNumber !== undefined) {
                placeBlock(config, entities, randomUnassignedCellNumber, mapWidth, type, currentTick);
            }
        }
    }
};
