export class GameTicker {
    public get CurrentTick(): number {
        return this.tickCount;
    }

    public get GameDurationTicks(): number {
        return this.gameDurationTicks;
    }

    public constructor(private tickCount: number, private gameDurationTicks: number) {}
    public Increment = () => {
        this.tickCount++;
    };
}
