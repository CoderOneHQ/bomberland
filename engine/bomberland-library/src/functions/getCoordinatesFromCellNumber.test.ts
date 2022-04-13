import { getCoordinatesFromCellNumber } from "./getCoordinatesFromCellNumber";

interface ITestCase {
    readonly cellNumber: number;
    readonly width: number;
    readonly expectedResult: [number, number];
}
const testCases: Array<ITestCase> = [];

testCases.push({ cellNumber: 0, width: 1, expectedResult: [0, 0] });
testCases.push({ cellNumber: 0, width: 3, expectedResult: [0, 0] });
testCases.push({ cellNumber: 4, width: 3, expectedResult: [1, 1] });
testCases.push({ cellNumber: 8, width: 3, expectedResult: [2, 2] });

testCases.push({ cellNumber: 3, width: 3, expectedResult: [0, 1] });
testCases.push({ cellNumber: 1, width: 3, expectedResult: [1, 0] });
testCases.push({ cellNumber: 19, width: 10, expectedResult: [9, 1] });

describe("getCoordinatesFromCellNumber", () => {
    testCases.forEach((c) => {
        const { cellNumber, width, expectedResult } = c;
        it(`should return ${expectedResult[0]}, ${expectedResult[1]} for cellNumber: ${cellNumber} with world width: ${width}`, () => {
            const result = getCoordinatesFromCellNumber(cellNumber, width);
            expect(result).toStrictEqual(expectedResult);
        });
    });
});
