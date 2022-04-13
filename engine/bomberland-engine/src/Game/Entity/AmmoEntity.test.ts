import { EntityType, IEntity } from "@coderone/bomberland-library";
import { getConfig } from "../../Config/getConfig";
import { AmmoEntity } from "./AmmoEntity";

describe("AmmoEntity", () => {
    test(`it should create an ammunition entity from state successfully`, () => {
        const expected: IEntity = { created: 50, expires: 90, hp: 1, type: EntityType.Ammo, x: 1, y: 0 };
        const config = getConfig();
        const result = new AmmoEntity(config, 1, 5, 1, 50).ToJSON();
        expect(result).toStrictEqual(expected);
    });
});
