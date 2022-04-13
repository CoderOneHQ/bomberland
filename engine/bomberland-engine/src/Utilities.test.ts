import { Utilities } from "./Utilities";

const prng = () => {
    return Math.random();
};

describe("Utilities.Shuffle", () => {
    test(`it should not contain any undefined elements after shuffling`, () => {
        const array = [1, 2, 3, 4, 5, 6];
        const result = Utilities.Shuffle(array, prng).some((value) => {
            return value === undefined;
        });
        expect(result).toStrictEqual(false);
    });

    test(`it should contain the same number of elements after shuffling`, () => {
        const array = [1, 2, 3, 4, 5, 6];
        const expectedLength = array.length;
        const result = Utilities.Shuffle(array, prng).length;
        expect(result).toStrictEqual(expectedLength);
    });
});
