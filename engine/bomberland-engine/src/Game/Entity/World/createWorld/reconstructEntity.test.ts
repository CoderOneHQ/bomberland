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

    test(`it preserves a FreezePowerup's created and derives expires from FreezePowerupDurationTicks (not BlastPowerupDurationTicks)`, () => {
        const created = 100;
        // Distinct durations so a regression to BlastPowerupDurationTicks would be visible.
        const config = getConfig({ MapHeight: 6, MapWidth: 6, FreezePowerupDurationTicks: 40, BlastPowerupDurationTicks: 999 });
        const entity: IEntity = { created, x: 4, y: 2, type: EntityType.FreezePowerup, expires: created + 40, hp: 1 };
        const cellNumber = getCellNumberFromCoordinates([entity.x, entity.y], 6);
        const gameTicker = new GameTicker(150, 300); // current tick deliberately != created
        const result = reconstructEntity(entity, 6, mock6x6GameState, cellNumber, gameTicker, config).ToJSON();
        expect(result.created).toBe(created);
        expect(result.expires).toBe(created + config.FreezePowerupDurationTicks);
    });

    test(`it preserves a BlastPowerup's created and expires on reload`, () => {
        const created = 100;
        const config = getConfig({ MapHeight: 6, MapWidth: 6, BlastPowerupDurationTicks: 40 });
        const entity: IEntity = { created, x: 4, y: 2, type: EntityType.BlastPowerup, expires: created + 40, hp: 1 };
        const cellNumber = getCellNumberFromCoordinates([entity.x, entity.y], 6);
        const gameTicker = new GameTicker(150, 300);
        const result = reconstructEntity(entity, 6, mock6x6GameState, cellNumber, gameTicker, config).ToJSON();
        expect(result.created).toBe(created);
        expect(result.expires).toBe(created + config.BlastPowerupDurationTicks);
    });

    test(`it reconstructs a bomb with its serialised blast_diameter, not the owning unit's current diameter`, () => {
        // Agent "a" units in mock6x6GameState carry blast_diameter 3; the serialised 5 must win.
        const bomb: IEntity = { created: 50, x: 2, y: 2, type: EntityType.Bomb, unit_id: "c", agent_id: "a", blast_diameter: 5, expires: 80 };
        const cellNumber = getCellNumberFromCoordinates([bomb.x, bomb.y], 6);
        const gameTicker = new GameTicker(60, 300);
        const config = getConfig({ MapHeight: 6, MapWidth: 6 });
        const result = reconstructEntity(bomb, 6, mock6x6GameState, cellNumber, gameTicker, config).ToJSON();
        expect(result.blast_diameter).toBe(5);
        expect(result.created).toBe(50);
    });
});
