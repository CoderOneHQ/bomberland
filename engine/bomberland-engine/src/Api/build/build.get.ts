import Application from "koa";
import { IServices } from "../routers";
import { Environment } from "../../Environment";

export const getBuildRoute = (_services: IServices) => {
    return async (ctx: Application.ParameterizedContext, _next: Application.Next) => {
        ctx.body = { build: Environment.Build };
    };
};
