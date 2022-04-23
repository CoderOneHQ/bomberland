export class TelemetryEvent {
    public static readonly AppInit = "engine/app/init";
    public static readonly AppAquisitionSource = "engine/app/acquisition-source";
    public static readonly ChangePasswordError = "engine/app/change-password/error";
    public static readonly ChangePasswordInit = "engine/app/change-password/init";
    public static readonly ChangePasswordSuccess = "engine/app/change-password/success";
    public static readonly ExternalLinkClicked = "engine/app/external-link-clicked";

    public static readonly LoginError = "engine/app/login/error";
    public static readonly LoginInit = "engine/app/login/init";
    public static readonly LoginSuccess = "engine/app/login/success";

    public static readonly EngineConnectError = "engine/app/engine/connect/error";
    public static readonly EngineConnectInit = "engine/app/engine/connect/init";
    public static readonly EngineConnectSuccess = "engine/app/engine/connect/success";

    public static readonly ActivationError = "engine/app/account-activation/error";
    public static readonly ActivationInit = "engine/app/account-activation/init";
    public static readonly ActivationSuccess = "engine/app/account-activation/success";
    public static readonly PageView = "engine/app/pageview";
    public static readonly SignupError = "engine/app/signup/error";
    public static readonly SignupInit = "engine/app/signup/init";
    public static readonly SignupSuccess = "engine/app/signup/success";
    public static readonly SubmitAgentError = "engine/app/submissions/submit/error";
    public static readonly SubmitAgentInit = "engine/app/submissions/submit/init";
    public static readonly SubmitAgentSuccess = "engine/app/submissions/submit/success";
    public static readonly BannerClicked = "engine/app/banner-clicked";
    public static readonly SubscribeNewsletterInit = "engine/app/subscribe/submit/init";
    public static readonly CreateTeamInit = "engine/app/create-team/init";
    public static readonly CreateTeamError = "engine/app/create-team/error";
    public static readonly CreateTeamSuccess = "engine/app/create-team/success";
    public static readonly JoinTeamInit = "engine/app/join-team/init";
    public static readonly JoinTeamError = "engine/app/join-team/error";
    public static readonly JoinTeamSuccess = "engine/app/join-team/success";
    public static readonly LeaveTeamInit = "engine/app/leave-team/init";
    public static readonly LeaveTeamError = "engine/app/leave-team/error";
    public static readonly LeaveTeamSuccess = "engine/app/leave-team/success";
    public static readonly UpdateTeamInit = "engine/app/update-team/init";
    public static readonly UpdateTeamError = "engine/app/update-team/error";
    public static readonly UpdateTeamSuccess = "engine/app/update-team/success";
    public static readonly LoadReplayInit = "engine/app/load-replay/init";
    public static readonly LoadReplaySuccess = "engine/app/load-replay/success";
    public static readonly LoadReplayError = "engine/app/load-replay/error";
    public static readonly DownloadInit = "engine/app/download/init";
    public static readonly ViewReplayButtonClicked = "engine/app/view-replay-button-clicked";
    public static readonly UpdateCountryInit = "engine/app/update-country/init";
    public static readonly UpdateCountrySuccess = "engine/app/update-country/success";
    public static readonly UpdateCountryError = "engine/app/update-country/error";
}
