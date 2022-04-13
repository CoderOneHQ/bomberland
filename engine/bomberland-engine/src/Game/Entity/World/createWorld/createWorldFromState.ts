import MersenneTwister from "mersenne-twister";
import { AbstractEntity } from "../../AbstractEntity";
import { Unit } from "../../../Unit/Unit";
import { CellReserver } from "../CellReserver";
import { EmptyCellTracker } from "../EmptyCellTracker";
import { getCellNumberFromCoordinates } from "@coderone/bomberland-library";
import { GameTicker } from "../../../Game/GameTicker";
import { IWorldState, World } from "../World";
import { PRNG } from "../../../Probability/Probability.types";
import { Telemetry } from "../../../../Services/Telemetry";
import { reconstructEntity } from "./reconstructEntity";
import { IConfig } from "../../../../Config/IConfig";
import { getConfig } from "../../../../Config/getConfig";

const reconstructAgentMap = (config: IConfig, worldState: IWorldState, mapWidth: number): Map<string, Unit> => {
    const unitMap = new Map<string, Unit>();
    worldState.units.forEach((unit) => {
        const reconstructedAgent = new Unit(
            config,
            unit.coordinates,
            mapWidth,
            unit.agent_id,
            unit.unit_id,
            unit.inventory.bombs,
            unit.hp,
            unit.blast_diameter,
            unit.invulnerability
        );
        unitMap.set(unit.unit_id, reconstructedAgent);
    });
    return unitMap;
};

const reconstructEntities = (
    worldState: IWorldState,
    width: number,
    gameTicker: GameTicker,
    cellReserver: CellReserver,
    config: IConfig
): Map<number, AbstractEntity> => {
    const entities = new Map<number, AbstractEntity>();
    worldState.entities.forEach((entity) => {
        const { x, y } = entity;
        const cellNumber = getCellNumberFromCoordinates([x, y], width);
        const reservedCell = cellReserver.ReserveAvailableCellNumber(cellNumber);
        if (reservedCell === undefined) {
            throw new Error(`Cell ${x}, ${y} - number ${cellNumber} could not be reserved`);
        }
        const reconstructedEntity = reconstructEntity(entity, width, worldState, cellNumber, gameTicker, config);

        entities.set(cellNumber, reconstructedEntity);
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

    const agentMap = reconstructAgentMap(config, worldState, width);
    const entities = reconstructEntities(worldState, width, gameTicker, cellReserver, config);

    const world = new World(telemetry, config, prngGame, cellReserver, emptyCellTracker, agentMap, entities, gameTicker, width, height);
    telemetry.Info(JSON.stringify(world.WorldState));
    return world;
};
