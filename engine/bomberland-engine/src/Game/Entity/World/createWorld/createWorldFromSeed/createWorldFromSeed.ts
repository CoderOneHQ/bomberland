import { AbstractEntity } from "../../../AbstractEntity";
import { Unit } from "../../../../Unit/Unit";
import { CellReserver } from "../../CellReserver";
import { EmptyCellTracker } from "../../EmptyCellTracker";
import { EntityType } from "@coderone/bomberland-library";
import { GameTicker } from "../../../../Game/GameTicker";
import { placeUnits } from "./placeAgents";
import { placeBlocks } from "./placeBlocks";
import { PRNG } from "../../../../Probability/Probability.types";
import { Telemetry } from "../../../../../Services/Telemetry";
import { World } from "../../World";
import { IConfig } from "../../../../../Config/IConfig";

const maxTries = 3;

export interface IWorldGenerationOptions {
    readonly width: number;
    readonly height: number;
    readonly steelBlocks: number;
    readonly woodenBlocks: number;
    readonly oreBlocks: number;
    readonly totalAgents: number;
    readonly isSymmetricalMap: boolean;
}

const validateWorldOptions = (options: IWorldGenerationOptions) => {
    const { totalAgents, isSymmetricalMap, width, height } = options;
    const isTotalAgentsEven = totalAgents % 2 === 0;
    if (isSymmetricalMap === true && isTotalAgentsEven === false) {
        throw new Error(`Symmetrical map requires a total number of agents an even integer. TotalAgents specified: ${totalAgents}`);
    }
    if (width <= 1 || height <= 1) {
        throw new Error(`World must have dimensions greater than 1x1`);
    }
};

export const createWorldFromSeed = (
    telemetry: Telemetry,
    config: IConfig,
    prngWorld: PRNG,
    prngGame: PRNG,
    options: IWorldGenerationOptions,
    gameTicker: GameTicker
): World => {
    const { width, height, steelBlocks, woodenBlocks, oreBlocks, totalAgents, isSymmetricalMap } = options;
    let attempts = 1;
    while (true) {
        try {
            const cellReserver = new CellReserver(width * height, prngWorld, width);
            const emptyCellTracker = new EmptyCellTracker(telemetry, width, height, prngWorld, cellReserver);
            const entities = new Map<number, AbstractEntity>();
            const unitMap = new Map<string, Unit>();
            const currentTick = gameTicker.CurrentTick;
            validateWorldOptions(options);
            placeUnits(config, unitMap, emptyCellTracker, totalAgents, width, isSymmetricalMap);

            placeBlocks(config, width, isSymmetricalMap, emptyCellTracker, entities, steelBlocks, EntityType.MetalBlock, currentTick);
            placeBlocks(config, width, isSymmetricalMap, emptyCellTracker, entities, woodenBlocks, EntityType.WoodBlock, currentTick);
            placeBlocks(config, width, isSymmetricalMap, emptyCellTracker, entities, oreBlocks, EntityType.OreBlock, currentTick);

            const world = new World(
                telemetry,
                config,
                prngGame,
                cellReserver,
                emptyCellTracker,
                unitMap,
                entities,
                gameTicker,
                width,
                height
            );

            emptyCellTracker.ClearAgentReservations();

            telemetry.Info(JSON.stringify(world.WorldState));
            return world;
        } catch (e) {
            telemetry.Warning(e as string);
            telemetry.Warning(`Failed to instantitate world attempt ${attempts} of ${maxTries}`);
            if (attempts >= maxTries) {
                throw new Error(`Exceeded max attempts of ${maxTries} trying to instantiate world`);
            }
            attempts++;
        }
    }
};
