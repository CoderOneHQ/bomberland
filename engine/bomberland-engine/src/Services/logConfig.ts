import { getConfig } from "../Config/getConfig";
import { CoderOneApi } from "./CoderOneApi/CoderOneApi";
import { EngineTelemetryEvent } from "./CoderOneApi/EngineTelemetryEvent";

const excludedObjectProperties = new Set<string>(["length", "prototype", "name"]);

export const logConfig = (telemetry: CoderOneApi) => {
    const configMap: { [key: string]: string } = {};
    const config = getConfig();
    Object.getOwnPropertyNames(config)
        .filter((key) => {
            return excludedObjectProperties.has(key) === false;
        })
        .forEach((key) => {
            configMap[key] = (config as any)[key];
        });
    telemetry.LogEvent(EngineTelemetryEvent.Config, configMap);
};
