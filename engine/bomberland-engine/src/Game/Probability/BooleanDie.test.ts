import { BooleanDie } from "./BooleanDie";

interface ITestCase {
    readonly decimal: number;
    readonly rng: number;
    readonly expectedRoll: boolean;
}

const testCases: Array<ITestCase> = [
    {
        decimal: 0.1,
        rng: 0.09,
        expectedRoll: true,
    },
    {
        decimal: 0.2,
        rng: 0.2,
        expectedRoll: false,
    },
];
describe("BooleanDie", () => {
    testCases.forEach((caseValues) => {
        const { decimal, rng, expectedRoll } = caseValues;

        test(`it should roll ${expectedRoll} for rng of ${rng} and probability value of ${decimal}`, () => {
            const die = new BooleanDie(decimal, () => rng);
            const result = die.Roll();

            expect(result).toStrictEqual(expectedRoll);
        });
    });

    test(`it should throw an error for a negative probability`, () => {
        const run = () => {
            new BooleanDie(-1, () => 1);
        };
        expect(run).toThrow(Error);
    });

    test(`it should throw an error for a probability > 1`, () => {
        const run = () => {
            new BooleanDie(2, () => 1);
        };
        expect(run).toThrow(Error);
    });
});
