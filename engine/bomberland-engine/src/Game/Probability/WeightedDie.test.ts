import { IWeighting, WeightedDie } from "./WeightedDie";

interface ITestCase {
    readonly description: string;
    readonly weightings: Array<IWeighting<string>>;
    readonly rng: number;
    readonly expected: string;
}

const testCases: Array<ITestCase> = [
    {
        description: "single weighting",
        weightings: [{ value: "a", weighting: 1 }],
        rng: 0.1,
        expected: "a",
    },
    {
        description: "split weighting below boundary",
        weightings: [
            { value: "a", weighting: 0.5 },
            { value: "b", weighting: 0.5 },
        ],
        rng: 0.499999,
        expected: "a",
    },
    {
        description: "split weighting at boundary",
        weightings: [
            { value: "a", weighting: 0.5 },
            { value: "b", weighting: 0.5 },
        ],
        rng: 0.5,
        expected: "b",
    },
    {
        description: "split weighting above boundary",
        weightings: [
            { value: "a", weighting: 0.5 },
            { value: "b", weighting: 0.5 },
        ],
        rng: 0.5,
        expected: "b",
    },
];

describe("WeightedDie", () => {
    testCases.forEach((caseValue) => {
        const { weightings, expected, rng, description } = caseValue;

        test(`it should return '${expected}' for rng value of ${rng} [${description}]`, () => {
            const die = new WeightedDie(weightings, () => rng);
            const result = die.Roll();
            expect(result).toStrictEqual(expected);
        });
    });

    test(`it should throw an error for a weighting total less than 1.0`, () => {
        const weightings = [{ value: "a", weighting: 0.99 }];
        const run = () => {
            new WeightedDie(weightings, () => 1);
        };
        expect(run).toThrow(Error);
    });
});
