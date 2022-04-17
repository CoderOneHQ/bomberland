import * as schema from "./validation.schema.json";
import Ajv from "ajv";
import { ISchema, schemas } from "./SchemaDefinition";

export const validator = new Ajv({ allErrors: true });
    validator.compile(schema)
;

export const isValidSchema = <T extends keyof typeof schemas>(data: unknown, schemaKeyRef: T): data is ISchema[T] => {
    validator.validate(schemaKeyRef as string, data);
    return Boolean(validator.errors) === false;
    }
;
