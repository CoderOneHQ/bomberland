import { getCellNumberFromCoordinates, getCoordinatesFromCellNumber } from "@coderone/bomberland-library";

export const horizontallyReflectCellNumber = (mapWidth: number, cellNumber: number): number | undefined => {
    const [x, y] = getCoordinatesFromCellNumber(cellNumber, mapWidth);
    const newX = mapWidth - x - 1;
    return x === newX ? undefined : getCellNumberFromCoordinates([newX, y], mapWidth);
};
