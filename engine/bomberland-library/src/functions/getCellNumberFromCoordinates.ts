export const getCellNumberFromCoordinates = (coordinates: [number, number], width: number): number => {
    const [x, y] = coordinates;
    return x + y * width;
};
