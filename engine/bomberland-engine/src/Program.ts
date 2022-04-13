import "source-map-support/register";
import { checkLatestEngineVersion } from "./Services/checkLatestEngineVersion";
import { ConnectionTracker } from "./Services/ConnectionTracker";
import { Environment } from "./Environment";
import { GameRunner } from "./Game/GameRunner";
import { GameWebsocket } from "./Services/GameWebSocket";
import { logConfig } from "./Services/logConfig";
import { sys } from "typescript";
import { Telemetry } from "./Services/Telemetry";
import { CoderOneApi } from "./Services/CoderOneApi/CoderOneApi";
import { getConfig } from "./Config/getConfig";

const config = getConfig({}, true);

const engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
const telemetry = new Telemetry(engineTelemetry, config.IsTelemetryEnabled);

checkLatestEngineVersion(Environment.Environment, Environment.Build);
logConfig(engineTelemetry);
console.log(`Bomberland game engine (build: ${Environment.Build})\n\n`);

const handle = (signal: NodeJS.Signals) => {
    telemetry.Info(`Received signal: ${signal}`);
    if (signal === "SIGINT" || signal === "SIGTERM") {
        telemetry.Info(`Shutting down`);
        sys.exit(0);
    }
};

process.on("SIGINT", handle);
process.on("SIGTERM", handle);

const connectionTracker = new ConnectionTracker();
const socket = new GameWebsocket(telemetry, config, connectionTracker, config.Port);

const gameRunner = new GameRunner(telemetry, config, engineTelemetry, socket, connectionTracker, config.IsTrainingModeEnabled === true);

gameRunner.Start();
