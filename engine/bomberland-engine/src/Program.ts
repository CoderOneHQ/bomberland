import http, { Server } from "http";
import Koa from "koa";
import koaBody from "koa-body";
import Router from "koa-router";
import serve from "koa-static";
import "source-map-support/register";
import { sys } from "typescript";
import { IServices, routers } from "./Api/routers";
import { getConfig } from "./Config/getConfig";
import { Environment } from "./Environment";
import { GameRunner } from "./Game/GameRunner";
import { checkLatestEngineVersion } from "./Services/checkLatestEngineVersion";
import { CoderOneApi } from "./Services/CoderOneApi/CoderOneApi";
import { ConnectionTracker } from "./Services/ConnectionTracker";
import { GameWebsocket } from "./Services/GameWebSocket";
import { logConfig } from "./Services/logConfig";
import { Telemetry } from "./Services/Telemetry";

const config = getConfig({}, true);

class Program {
    private engineTelemetry: CoderOneApi;
    private telemetry: Telemetry;
    private httpServer: Server;
    private app: Koa;

    public constructor() {
        this.app = new Koa();
        this.engineTelemetry = new CoderOneApi(Environment.Environment, config, true, Environment.Build);
        this.telemetry = new Telemetry(this.engineTelemetry, config.IsTelemetryEnabled);
        this.httpServer = http.createServer(this.app.callback());
        this.instantiateGame();
        if (config.UIEnabled) {
            this.instantiateUI();
        }
        this.instantiateApi();
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
        this.app.use(serve("public"));
    };

    private instantiateApi = () => {
        const services: IServices = { coderoneApi: this.engineTelemetry };
        this.app.use(koaBody());
        const apiRouter = new Router({ prefix: "/api" });
        routers.forEach((getRouter) => {
            const router = getRouter(services);
            apiRouter.use(router.routes(), router.allowedMethods());
        });
        this.app.use(apiRouter.allowedMethods());
        this.app.use(apiRouter.routes());
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
