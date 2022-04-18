export abstract class CoderOneRoute {
    public static readonly AdjudicatedGames = "/adjudicated-games";
    public static readonly BlogIndex = "/blog";
    public static readonly Bomberland = "/bomberland";
    public static readonly Dashboard = "/dashboard";
    public static readonly DocumentationGettingStarted = "/docs/getting-started";
    public static readonly DocumentationSubmissionInstructions = "/docs/submission-instructions";
    public static readonly DocumentationIndex = "/docs";
    public static readonly Game = "/game";
    public static readonly History = "/history";
    public static readonly Home = "/";
    public static readonly Leaderboard = "/leaderboard";
    public static readonly Login = "/login";
    public static readonly Pricing = "/pricing";
    public static readonly Account = "/account";
    public static readonly Replays = "/replays";
    public static readonly Signup = "/signup";
    public static readonly Submissions = "/submissions";
    public static readonly Subscription = "/subscription";
    public static readonly Team = "/team";
    public static readonly AboutUs = "/about-us";
    public static readonly ProfileBase = "/user/";
    public static readonly GameInstanceRoute = (connectionString: string): string => {
        return `${CoderOneRoute.Game}/?uri=${encodeURIComponent(connectionString)}`;
    };
}
