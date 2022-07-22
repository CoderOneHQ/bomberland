import { getCellNumberFromCoordinates } from "@coderone/bomberland-library";
import MersenneTwister from "mersenne-twister";
import { getConfig } from "../../../../Config/getConfig";
import { IConfig } from "../../../../Config/IConfig";
import { Telemetry } from "../../../../Services/Telemetry";
import { GameTicker } from "../../../Game/GameTicker";
import { PRNG } from "../../../Probability/Probability.types";
import { Unit } from "../../../Unit/Unit";
import { CellReserver } from "../CellReserver";
import { EmptyCellTracker } from "../EmptyCellTracker";
import { IWorldState, World } from "../World";
import { EntityTracker } from "./../EntityTracker";
import { UnitTracker } from "./../UnitTracker";
import { reconstructEntity } from "./reconstructEntity";

const reconstructUnitTracker = (config: IConfig, worldState: IWorldState, prngGame: PRNG): UnitTracker => {
    const unitTracker = new UnitTracker(prngGame);
    worldState.units.forEach((unit) => {
        const reconstructedUnit = new Unit(
            config,
            unit.coordinates,
            config.MapWidth,
            unit.agent_id,
            unit.unit_id,
            unit.inventory.bombs,
            unit.hp,
            unit.blast_diameter,
            unit.invulnerable,
            unit.stunned
        );
        unitTracker.Set(reconstructedUnit);
    });
    return unitTracker;
};

const reconstructEntities = (
    worldState: IWorldState,
    width: number,
    gameTicker: GameTicker,
    cellReserver: CellReserver,
    config: IConfig
): EntityTracker => {
    const entities = new EntityTracker();
    worldState.entities.forEach((entity) => {
        const { x, y } = entity;
        const cellNumber = getCellNumberFromCoordinates([x, y], width);
        const reservedCell = cellReserver.ReserveAvailableCellNumber(cellNumber);
        if (reservedCell === undefined) {
            throw new Error(`Cell ${x}, ${y} - number ${cellNumber} could not be reserved`);
        }
        const reconstructedEntity = reconstructEntity(entity, width, worldState, cellNumber, gameTicker, config);

        entities.Add(reconstructedEntity);
    });
    return entities;
};

export const generateWorldFromState = (
    telemetry: Telemetry,
    worldState: IWorldState,
    width: number,
    height: number,
    gameTicker: GameTicker
): World => {
    const config = getConfig({ MapHeight: height, MapWidth: width });
    const randomSeed = Math.floor(Math.random() * Math.random() * (10 ^ 6));
    const mersenneTwisterGame = new MersenneTwister(randomSeed);
    const prngGame: PRNG = () => mersenneTwisterGame.random();
    const cellReserver = new CellReserver(width * height, prngGame, width);
    const emptyCellTracker = new EmptyCellTracker(telemetry, width, height, prngGame, cellReserver);

    const unitTracker = reconstructUnitTracker(config, worldState, prngGame);
    const entities = reconstructEntities(worldState, width, gameTicker, cellReserver, config);

    const world = new World(telemetry, config, prngGame, cellReserver, emptyCellTracker, unitTracker, entities, gameTicker, width, height);
    telemetry.Info(JSON.stringify(world.WorldState));
    return world;
};
