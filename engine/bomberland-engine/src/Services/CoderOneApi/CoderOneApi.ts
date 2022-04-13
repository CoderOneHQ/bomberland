import { EndGameStatePacket } from "@coderone/bomberland-library";
import { EngineTelemetryEvent } from "./EngineTelemetryEvent";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { IConfig } from "../../Config/IConfig";

export class CoderOneApi {
    private apiPath: string;
    private launchId = uuidv4();
    public constructor(private environment: string, private config: IConfig, private isEnabled: boolean, private build: string | number) {
        this.apiPath = environment === "production" ? "https://www.gocoder.one/api" : "http://api:8080";
        if (process.env.ENGINE_TELEMETRY_STAGE_MODE !== undefined) {
            this.apiPath = "https://www.stage-gocoder.one/api";
        }
    }

    public LogEvent = async (event: EngineTelemetryEvent, data: any) => {
        if (this.isEnabled) {
            await this.sendTelemetry(event, data);
        }
    };

    private sendTelemetry = async (event: EngineTelemetryEvent, payload: any) => {
        try {
            const request = axios.post(`${this.apiPath}/telemetry/engine`, {
                launchId: this.launchId,
                build: this.build,
                event,
                data: payload,
            });

            await request;
        } catch (e) {
            if (this.environment !== "production") {
                throw e;
            }
        }
    };

    public SendReplayToWebhook = async (replay: EndGameStatePacket) => {
        const webhook = this.config.ReplayWebhook;
        const token = this.config.HookAuthToken;
        if (webhook === undefined || token === undefined) {
            return;
        }
        try {
            const request = axios.put(
                webhook,
                {
                    launchId: this.launchId,
                    build: this.build,
                    replay: replay,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            await request;
        } catch (e) {
            if (this.environment !== "production") {
                throw e;
            }
        }
    };
}
