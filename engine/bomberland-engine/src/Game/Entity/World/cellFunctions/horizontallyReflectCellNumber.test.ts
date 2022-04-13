import { horizontallyReflectCellNumber } from "./horizontallyReflectCellNumber";

describe("horizontallyReflectCellNumber", () => {
    test(`it should should compute the correct value for an even width`, () => {
        const result = horizontallyReflectCellNumber(2, 1);
        expect(result).toStrictEqual(0);
    });

    test(`it should should compute the correct value for an odd width in the middle`, () => {
        const result = horizontallyReflectCellNumber(3, 1);
        expect(result).toStrictEqual(undefined);
    });

    test(`it should should compute the correct value for an odd width not in the middle`, () => {
        const result = horizontallyReflectCellNumber(3, 2);
        expect(result).toStrictEqual(0);
    });
});
