import { CoderOneApi } from "./../Services/CoderOneApi/CoderOneApi";
import { buildRouter } from "./build/build.router";
import { indexRouter } from "./index.router";
import Router from "koa-router";
import { telemetryRouter } from "./telemetry/telemetry.router";

export interface IServices {
    readonly coderoneApi: CoderOneApi;
}

export const routers: Array<(services: IServices) => Router> = [indexRouter, telemetryRouter, buildRouter];
