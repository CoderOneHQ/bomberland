import Application from "koa";
import { validateRequestSchema } from "../../runtime-validation/validateRequestSchema";
import { IServices } from "../routers";

export const postTelemetryRoute = (_services: IServices) => {
    return async (ctx: Application.ParameterizedContext, _next: Application.Next) => {
        const { body } = ctx.request;
        if (validateRequestSchema(ctx, body, "#/definitions/IPostTelemetryBody")) {
            console.log(body);

            ctx.status = 202;
        }
    };
};
