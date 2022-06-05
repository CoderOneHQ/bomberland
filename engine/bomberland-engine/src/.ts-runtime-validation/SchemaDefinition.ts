import { IHashMapObject } from "../ValidationTypes/IHashMapObject.jsonschema";
import { ValidAdminPacket, ValidAgentPacket, ValidServerPacket } from "../ValidationTypes/Library.types.jsonschema";

export const schemas: Record<keyof ISchema, string> = {
    ["#/definitions/IHashMapObject"]: "IHashMapObject",
    ["#/definitions/ValidAdminPacket"]: "ValidAdminPacket",
    ["#/definitions/ValidAgentPacket"]: "ValidAgentPacket",
    ["#/definitions/ValidServerPacket"]: "ValidServerPacket",
};

export interface ISchema {
    readonly ["#/definitions/IHashMapObject"]: IHashMapObject;
    readonly ["#/definitions/ValidAdminPacket"]: ValidAdminPacket;
    readonly ["#/definitions/ValidAgentPacket"]: ValidAgentPacket;
    readonly ["#/definitions/ValidServerPacket"]: ValidServerPacket;
}
