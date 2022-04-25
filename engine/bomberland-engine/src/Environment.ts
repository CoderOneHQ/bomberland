const environment = process.env.ENVIRONMENT ?? "";

const build = process.env.BUILD ?? "0";
export abstract class Environment {
    public static Environment = environment;
    public static Build = build;
}
