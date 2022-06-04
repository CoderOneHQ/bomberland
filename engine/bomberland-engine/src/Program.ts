import http, { Server } from "http";
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
import express from "express";

const config = getConfig({}, true);

class Program {
    private engineTelemetry: CoderOneApi;
    private telemetry: Telemetry;
    private httpServer: Server;
    private app: express.Express;

    public constructor() {
        this.app = express();
        this.engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
        this.telemetry = new Telemetry(this.engineTelemetry, config.IsTelemetryEnabled);
        this.httpServer = http.createServer(this.app);
        this.instantiateGame();
        if (config.UIEnabled) {
            this.instantiateUI();
        }
    }

    private instantiateGame = () => {
        checkLatestEngineVersion(Environment.Environment, Environment.Build);
        logConfig(this.engineTelemetry);
        console.log(`Bomberland game engine (build: ${Environment.Build})\n\n`);

        this.attachErrorHandlers();

        const connectionTracker = new ConnectionTracker();
        const socket = new GameWebsocket(this.telemetry, config, connectionTracker, this.httpServer);

        const gameRunner = new GameRunner(
            this.telemetry,
            config,
            this.engineTelemetry,
            socket,
            connectionTracker,
            config.IsTrainingModeEnabled === true
        );

        gameRunner.Start();
    };

    private instantiateUI = () => {
        this.app.use(express.static("public"));
    };

    private attachErrorHandlers = () => {
        const handle = (signal: NodeJS.Signals) => {
            this.telemetry.Info(`Received signal: ${signal}`);
            if (signal === "SIGINT" || signal === "SIGTERM") {
                this.telemetry.Info(`Shutting down`);
                sys.exit(0);
            }
        };

        process.on("SIGINT", handle);
        process.on("SIGTERM", handle);
    };
    public Listen = () => {
        this.httpServer.listen(config.Port);
        this.telemetry.Info(`Open for connections on port: ${config.Port}`);
        if (config.UIEnabled) {
            this.telemetry.Info(`UI running on port: ${config.Port}`);
        }
    };
}

const engine = new Program();
engine.Listen();
