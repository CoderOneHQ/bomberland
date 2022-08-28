import { IReplaySegment } from "./GameReplay";

export const getSegmentIndexFromTick = (tick: number, segments: Array<IReplaySegment>): number => {
    if (segments.length === 0) {
        return -1;
    }
    let minIndex = 0;
    let maxIndex = segments.length - 1;
    let attempts = 0;
    while (minIndex <= maxIndex && attempts++ < 500) {
        const midpointIndex = Math.floor((minIndex + maxIndex) / 2);
        const midSegment = segments[midpointIndex];
        const { startTick, endTick } = midSegment;

        if (tick < startTick) {
            maxIndex = midpointIndex - 1;
        } else if (tick > endTick) {
            minIndex = midpointIndex + 1;
        } else {
            return midpointIndex;
        }
    }

    return -1;
};
