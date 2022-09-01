import { getOrigin } from "./getOrigin";

export abstract class Constants {
    public static readonly ApiRoot = `${getOrigin()}/api`;
    public static readonly DiscordLink = "https://discord.gg/NkfgvRN";
    public static readonly DiscordSupportLink = "https://discord.gg/MKp2r28Vm9";
    public static readonly Origin = getOrigin();
    public static readonly Home = "https://www.gocoder.one";
    public static readonly ReportBugEmail = "mailto:humans@gocoder.one?subject=Reporting a bug/issue with Coder One";
    public static readonly ReportBugIssuesLink = "https://github.com/CoderOneHQ/bomberland/issues";
}
