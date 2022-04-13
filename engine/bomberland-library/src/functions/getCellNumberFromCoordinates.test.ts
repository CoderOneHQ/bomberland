import { getCellNumberFromCoordinates } from "./getCellNumberFromCoordinates";

interface ITestCase {
    readonly coordinates: [number, number];
    readonly width: number;

    readonly expectedResult: number;
}
const testCases: Array<ITestCase> = [];

testCases.push({ coordinates: [0, 0], width: 1, expectedResult: 0 });
testCases.push({ coordinates: [0, 0], width: 3, expectedResult: 0 });
testCases.push({ coordinates: [1, 1], width: 3, expectedResult: 4 });
testCases.push({ coordinates: [2, 2], width: 3, expectedResult: 8 });
testCases.push({ coordinates: [0, 1], width: 3, expectedResult: 3 });
testCases.push({ coordinates: [1, 0], width: 3, expectedResult: 1 });

describe("getCellNumberFromCoordinates", () => {
    testCases.forEach((c) => {
        const { coordinates, width, expectedResult } = c;
        it(`should return ${expectedResult} for coordinate: ${coordinates[0]}, ${coordinates[1]} with world width: ${width}`, () => {
            const result = getCellNumberFromCoordinates(coordinates, width);
            expect(result).toStrictEqual(expectedResult);
        });
    });
});
