import { indexRouter } from "./index.router";
import Router from "koa-router";
import { telemetryRouter } from "./telemetry/telemetry.router";

export interface IServices {}

export const routers: Array<(services: IServices) => Router> = [indexRouter, telemetryRouter];
