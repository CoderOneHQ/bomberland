import { getSegmentIndexFromTick } from "./getSegmentIndexFromTick";
import { IReplaySegment } from "./GameReplay";
import { mockSegmentsA } from "./mockSegmentsA";
import { mockSegmentsB } from "./mockSegmentsB";

const testSegments: Array<IReplaySegment> = [
    { cacheIndex: 0, startTick: 0, endTick: 0 },
    { cacheIndex: 1, startTick: 1, endTick: 10 },
    { cacheIndex: 2, startTick: 11, endTick: 100 },
    { cacheIndex: 3, startTick: 101, endTick: 1000 },
];

describe("getSegmentIndexFromTick", () => {
    it(`should return -1 for an empty list`, () => {
        const result = getSegmentIndexFromTick(1, []);
        const expectedResult = -1;
        expect(result).toStrictEqual(expectedResult);
    });

    it(`should return the correct segment from a valid segment list`, () => {
        const result = getSegmentIndexFromTick(1, testSegments);
        const expectedResult = 1;
        expect(result).toStrictEqual(expectedResult);
    });

    it(`should return the correct segment from a valid segment list`, () => {
        const result = getSegmentIndexFromTick(0, testSegments);
        const expectedResult = 0;
        expect(result).toStrictEqual(expectedResult);
    });

    it(`should return the correct segment from a valid segment list`, () => {
        const result = getSegmentIndexFromTick(105, testSegments);
        const expectedResult = 3;
        expect(result).toStrictEqual(expectedResult);
    });

    it(`should return the correct segment from a valid segment list`, () => {
        const result = getSegmentIndexFromTick(4, mockSegmentsA);
        const expectedResult = 3;
        expect(result).toStrictEqual(expectedResult);
    });

    it(`should return the correct segment from a valid segment list`, () => {
        const result = getSegmentIndexFromTick(4, mockSegmentsB);
        const expectedResult = 3;
        expect(result).toStrictEqual(expectedResult);
    });
});
