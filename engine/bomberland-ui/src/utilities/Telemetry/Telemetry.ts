import { v4 as uuidv4 } from "uuid";
import axios, { AxiosRequestConfig } from "axios";
import { TelemetryEvent } from "./TelemetryEvent";
import { Constants } from "../Constants";
const sourceParamKey = "s";

class Telemetry {
    public InitId: string;

    public constructor() {
        this.InitId = uuidv4();
        this.logInit();
    }

    public Log = (event: TelemetryEvent, data: any = null) => {
        this.sendTelemetry(event, data);
    };

    private logInit = () => {
        if (typeof window !== "undefined") {
            const data = { referrer: window.document.referrer };
            this.sendTelemetry(TelemetryEvent.AppInit, data);
        }
    };

    private sendTelemetry = async (event: TelemetryEvent, payload: any) => {
        const request = axios.post(`${Constants.Origin}/api/telemetry`, { _initId: this.InitId, event, data: payload }, this.getConfig());

        const { data } = await request;
        return data;
    };

    private getConfig = (): AxiosRequestConfig => {
        if (typeof window === "undefined") {
            return {};
        }
        return { headers: { "x-clientId": null, "x-initId": this.InitId } };
    };
}
export const telemetry = new Telemetry();
