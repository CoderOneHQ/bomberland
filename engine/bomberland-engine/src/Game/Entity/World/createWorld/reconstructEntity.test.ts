import { EntityType, getCellNumberFromCoordinates, IEntity } from "@coderone/bomberland-library";
import { getConfig } from "../../../../Config/getConfig";
import { mock6x6GameState } from "../../../../mocks/mock6x6GameState";
import { GameTicker } from "../../../Game/GameTicker";
import { reconstructEntity } from "./reconstructEntity";

describe("reconstructEntity", () => {
    test(`it should recreate an entity given some valid configuration`, () => {
        const entity: IEntity = { created: 316, x: 4, y: 2, type: EntityType.Blast };
        const cellNumber = getCellNumberFromCoordinates([entity.x, entity.y], 6);
        const gameTicker = new GameTicker(0, 300);
        const config = getConfig({ MapHeight: 6, MapWidth: 6 });
        const result = reconstructEntity(entity, 6, mock6x6GameState, cellNumber, gameTicker, config).ToJSON();
        const expected = entity;
        expect(result).toStrictEqual(expected);
    });
});
