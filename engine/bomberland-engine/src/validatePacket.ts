import { ISchema, schemas } from "./runtime-validation/SchemaDefinition";
import * as schema from "./runtime-validation/validation.schema.json";
import Ajv, { Options } from "ajv";
import betterAjvErrors from "better-ajv-errors";
import { Telemetry } from "./Services/Telemetry";

const validator = new Ajv({ jsonPointers: true } as Options);
validator.compile(schema);

export const validatePacket = <T extends keyof typeof schemas>(
    telemetry: Telemetry,
    data: unknown,
    schemaKeyRef: T
): data is ISchema[T] => {
    validator.validate(schemaKeyRef as string, data);
    if (validator.errors) {
        const output = betterAjvErrors(schema, data, validator.errors, { format: "cli" });
        telemetry.Error(`Packet of type: ${schemaKeyRef} rejected:`);
        telemetry.ValidationError(output);
    }
    return Boolean(validator.errors) === false;
};
