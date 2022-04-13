import { generateGrowingFireProgression } from "./generateGrowingFireProgression";

describe("generateGrowingFireProgression", () => {
    test(`it should recreate a correct fire progression order for a 3x3 world`, () => {
        const result = generateGrowingFireProgression(3, 3);
        const expected = [6, 2, 7, 1, 8, 0, 5, 3, 4];
        expect(result).toStrictEqual(expected);
    });

    test(`it should recreate a correct fire progression order for a 4x4 world`, () => {
        const result = generateGrowingFireProgression(4, 4);
        const expected = [12, 3, 13, 2, 14, 1, 15, 0, 11, 4, 7, 8, 6, 9, 5, 10];
        expect(result).toStrictEqual(expected);
    });
});
