import Application from "koa";
import { validateRequestSchema } from "../../runtime-validation/validateRequestSchema";
import { EngineTelemetryEvent } from "../../Services/CoderOneApi/EngineTelemetryEvent";
import { IServices } from "../routers";

export const postTelemetryRoute = (services: IServices) => {
    const { coderoneApi } = services;
    return async (ctx: Application.ParameterizedContext, _next: Application.Next) => {
        const { body } = ctx.request;
        if (validateRequestSchema(ctx, body, "#/definitions/IPostTelemetryBody")) {
            coderoneApi.LogEvent(EngineTelemetryEvent.UITelemetry, body);
            ctx.status = 202;
        }
    };
};
