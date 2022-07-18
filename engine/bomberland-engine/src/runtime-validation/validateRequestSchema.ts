import * as schema from "./validation.schema.json";
import Ajv from "ajv";
import Application from "koa";
import { ISchema, schemas } from "./SchemaDefinition";

const validator = new Ajv({ allErrors: true });
validator.compile(schema);

export const validateRequestSchema = <T extends keyof typeof schemas>(
    ctx: Application.ParameterizedContext,
    data: unknown,
    schemaKeyRef: T
): data is ISchema[T] => {
    validator.validate(schemaKeyRef as string, data);
    if (validator.errors) {
        console.error(validator.errors);
        ctx.status = 400;
        ctx.body = {
            error: "bad request",
        };
    }
    return Boolean(validator.errors) === false;
};
