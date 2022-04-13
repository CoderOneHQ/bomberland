import { CoderOneApi } from "./CoderOneApi/CoderOneApi";

export class Telemetry {
    public constructor(public Engine: CoderOneApi, private isEnabled: boolean = true) {}

    public Info = (log: string) => {
        if (this.isEnabled === true) {
            console.info(`${new Date().toISOString()} - ${log}`);
        }
    };

    public Error = (log: string) => {
        if (this.isEnabled === true) {
            console.error(`${new Date().toISOString()} - ${log}`);
        }
    };

    public Warning = (log: string) => {
        if (this.isEnabled === true) {
            console.error(`${new Date().toISOString()} - ${log}`);
        }
    };

    public ValidationError = (error: Array<betterAjvErrors.IOutputError> | void) => {
        console.error(error);
    };

    public Debug = (log: string) => {
        if (this.isEnabled === true) {
            console.info(`${new Date().toISOString()} - ${log}`);
            console.trace();
        }
    };
}
