export const getCoordinatesFromCellNumber = (cellNumber: number, width: number): [number, number] => {
    const x = cellNumber % width;
    const y = Math.floor(cellNumber / width);
    return [x, y];
};
