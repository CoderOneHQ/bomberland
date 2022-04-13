import { PRNG } from "./Game/Probability/Probability.types";

export abstract class Utilities {
    public static get UTCNowMs(): number {
        return new Date().valueOf();
    }
    public static Sleep = async (timeMs: number): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeMs);
        });
    };

    // based off: https://stackoverflow.com/a/2450976
    public static Shuffle = <T>(array: Array<T>, prng: PRNG): Array<T> => {
        let currentIndex = array.length,
            randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(prng() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }

        return array;
    };
}
