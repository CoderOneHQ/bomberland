import Router from "koa-router";
import { IServices } from "../routers";
import { postTelemetryRoute } from "./telemetry.post";

export const telemetryRouter = (services: IServices) => {
    const router = new Router();
    router.post("/telemetry", postTelemetryRoute(services));
    return router;
};
