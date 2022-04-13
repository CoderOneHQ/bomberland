const fs = require("fs");
const schema = require("../src/validation.schema.json");
const OUTPUT_FILE = "./src/SchemaDefinition.ts";

const reservedDefinitionNameFilterFn = (definition) => {
    return definition !== "ISchema" && definition !== "Schemas";
};

const definitions = Object.keys(schema.definitions).filter(reservedDefinitionNameFilterFn);

const lines = [];
lines.push(`// THIS IS AN AUTOGENERATED FILE PLEASE DO NOT MODIFY MANUALLY`);

lines.push(`import { ${definitions.join(", ")} } from "./ValidationTypes";`);
lines.push("");

lines.push(`export const schemas: Record<keyof ISchema, string> = {`);
definitions.forEach((definition) => {
    lines.push(`  ["#/definitions/${definition}"]: "${definition}",`);
});
lines.push(`};`);

lines.push("");

lines.push("export interface ISchema {");

definitions.forEach((definition) => {
    lines.push(`    ["#/definitions/${definition}"]: ${definition},`);
});
lines.push("};");
lines.push("");

const output = lines.join("\n");

fs.writeFile(OUTPUT_FILE, output, { flag: "w" }, function (err) {
    if (err) {
        return console.log(err);
    }
});
