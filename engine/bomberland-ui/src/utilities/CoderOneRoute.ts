export abstract class CoderOneRoute {
    public static readonly Bomberland = "https://www.gocoder.one/bomberland";
    public static readonly DocumentationIndex = "/docs";
    public static readonly Game = "/game";
    public static readonly GameInstanceRoute = (connectionString: string): string => {
        return `${CoderOneRoute.Game}/?uri=${encodeURIComponent(connectionString)}`;
    };
    public static readonly DocumentationGettingStarted = "/docs/getting-started";
}
