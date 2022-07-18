import Router from "koa-router";
import { IServices } from "./routers";

export const indexRouter = (_services: IServices): Router => {
    const router = new Router();

    router.get("/", (ctx, _next) => {
        ctx.body = { time: new Date().toISOString() };
    });
    return router;
};
