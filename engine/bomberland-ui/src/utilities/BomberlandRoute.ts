export abstract class BomberlandRoute {
    public static readonly Bomberland = "https://www.gocoder.one/bomberland";
    public static readonly DocumentationIndex = "/docs";
    public static readonly Game = "/game";
    public static readonly Replays = "/replays";
    public static readonly GameInstanceRoute = (connectionString: string): string => {
        return `${BomberlandRoute.Game}/?uri=${encodeURIComponent(connectionString)}`;
    };
    public static readonly DocumentationGettingStarted = "/docs/getting-started";
}
