import { PRNG } from "./Probability.types";
import { WeightedDie } from "./WeightedDie";

export class BooleanDie {
    private weightedDie: WeightedDie<boolean>;

    public constructor(decimal: number, prng: PRNG) {
        if (decimal > 1 || decimal < 0) {
            throw new Error(`Invalid probability of ${decimal}`);
        }
        const nullEventProbability = 1 - decimal;
        this.weightedDie = new WeightedDie<boolean>(
            [
                { weighting: decimal, value: true },
                { weighting: nullEventProbability, value: false },
            ],
            prng
        );
    }

    public Roll = (): boolean => {
        return this.weightedDie.Roll();
    };
}
