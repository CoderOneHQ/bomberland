import { EntityType } from "@coderone/bomberland-library";
import { IConfig } from "../../../../../Config/IConfig";
import { createBlockEntity } from "../../../createBlockEntity";
import { EmptyCellTracker } from "../../EmptyCellTracker";
import { EntityTracker } from "./../../EntityTracker";

const placeBlock = (
    config: IConfig,
    entities: EntityTracker,
    cellNumber: number,
    mapWidth: number,
    type: EntityType,
    currentTick: number
) => {
    const entity = createBlockEntity(config, cellNumber, mapWidth, type, undefined, undefined, currentTick);
    entities.Add(entity);
};

export const placeBlocks = (
    config: IConfig,
    mapWidth: number,
    isSymmetricalMap: boolean,
    emptyCellTracker: EmptyCellTracker,
    entityTracker: EntityTracker,
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
                placeBlock(config, entityTracker, cellA, mapWidth, type, currentTick);
                placeBlock(config, entityTracker, cellB, mapWidth, type, currentTick);
            }
        }
    } else {
        for (let i = 0; i < numberBlocksToPlace; i++) {
            const randomUnassignedCellNumber = emptyCellTracker.ReserveRandomEmptyCell();
            if (randomUnassignedCellNumber !== undefined) {
                placeBlock(config, entityTracker, randomUnassignedCellNumber, mapWidth, type, currentTick);
            }
        }
    }
};
