export interface IPostTelemetryBody {
    readonly _initId: string;
    readonly event: string;
    readonly data: any;
}
