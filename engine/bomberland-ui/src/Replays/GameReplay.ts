import { GameStateMachine, IEndGameState, IGameState } from "@coderone/bomberland-library";
import { getSegmentIndexFromTick } from "./getSegmentIndexFromTick";

export interface IReplaySegment {
    readonly cacheIndex: number;
    readonly startTick: number;
    readonly endTick: number;
}

export class GameReplay {
    private cache: Array<Omit<IGameState, "connection">> = [];
    private replaySegments: Array<IReplaySegment> = [];
    private totalTicks = 0;

    public get TotalTicks(): number {
        return this.totalTicks;
    }

    public constructor(replayString: string) {
        const parsedReplay = JSON.parse(replayString) as any;
        if (parsedReplay.type === "endgame_state") {
            const replay = parsedReplay.payload as IEndGameState;
            this.parseReplay(replay);
        } else {
            this.parseReplay(parsedReplay as IEndGameState);
        }
    }

    private parseReplay = (parsedReplay: IEndGameState) => {
        const initialState = parsedReplay.initial_state;
        const stateMachine = new GameStateMachine(initialState);
        this.replaySegments.push({ cacheIndex: 0, startTick: 0, endTick: 0 });
        this.cache.push(stateMachine.State);
        parsedReplay.history.forEach((event, index) => {
            const previous = this.replaySegments[this.replaySegments.length - 1];
            this.replaySegments[this.replaySegments.length - 1] = { ...previous, endTick: event.tick - 1 };
            this.replaySegments.push({ cacheIndex: index + 1, startTick: event.tick, endTick: event.tick });

            stateMachine.Update(event);
            const state = stateMachine.State;
            const stateCopy = JSON.parse(JSON.stringify(state));
            this.cache.push(stateCopy);
        });
        this.totalTicks = parsedReplay.history[parsedReplay.history.length - 1].tick;
    };

    private getCacheIndex = (tick: number): number => {
        const segmentIndex = getSegmentIndexFromTick(tick, this.replaySegments);
        const segment = this.replaySegments[segmentIndex];
        return segment.cacheIndex;
    };

    public GetState = (tick: number) => {
        const index = this.getCacheIndex(tick);
        return this.cache[index];
    };
}
