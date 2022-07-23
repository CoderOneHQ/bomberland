import Router from "koa-router";
import { IServices } from "../routers";
import { getBuildRoute } from "./build.get";

export const buildRouter = (services: IServices) => {
    const router = new Router();
    router.get("/build", getBuildRoute(services));
    return router;
};
