import { PRNG } from "./Probability.types";

export interface IWeighting<T> {
    readonly value: T;
    readonly weighting: number;
}

interface IDistributionInterval<T> {
    readonly start: number;
    readonly end: number;
    readonly value: T;
}

export class WeightedDie<T> {
    private probabilityDistribution: Array<IDistributionInterval<T>> = [];
    public constructor(private weightings: Array<IWeighting<T>>, private prng: PRNG) {
        this.ensureValidWeightings();
        this.mapProbabilityDistribution();
    }

    private ensureValidWeightings = () => {
        const weightingSum = this.weightings.reduce((sum, currentValue) => {
            return sum + currentValue.weighting;
        }, 0);

        if (weightingSum !== 1) {
            throw new Error(
                `Weightings must add up to 1.0 got: ${weightingSum} from input weightings: ${this.weightings
                    .map((weighting) => weighting.value)
                    .join(",")}`
            );
        }
    };

    private mapProbabilityDistribution = () => {
        let cumulativeWeighting = 0;
        this.weightings.forEach((weight) => {
            const { value, weighting } = weight;
            const start = cumulativeWeighting;
            const end = cumulativeWeighting + weighting;

            const interval: IDistributionInterval<T> = { start, end, value };
            this.probabilityDistribution.push(interval);
            cumulativeWeighting += weighting;
        });
    };

    public Roll = (): T => {
        const randomNumber = this.prng();
        for (let interval of this.probabilityDistribution) {
            const { start, end, value } = interval;
            if (start <= randomNumber && randomNumber < end) {
                return value;
            }
        }
        throw new Error("Value outside distribution");
    };
}
