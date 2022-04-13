import MersenneTwister from "mersenne-twister";
import { createWorldFromSeed, IWorldGenerationOptions } from "../Entity/World/createWorld/createWorldFromSeed/createWorldFromSeed";
import { Game } from "./Game";
import { GameTicker } from "./GameTicker";
import { PRNG } from "../Probability/Probability.types";
import { Telemetry } from "../../Services/Telemetry";
import { v4 as uuidv4 } from "uuid";
import { IConfig } from "../../Config/IConfig";

export const createGameFromSeed = (telemetry: Telemetry, config: IConfig, worldSeed: number, gameSeed: number): Game => {
    const {
        MapWidth: width,
        MapHeight: height,
        TickrateHz: tickRateHz,
        GameDurationTicks: gameDurationTicks,
        FireSpawnIntervalTicks: fireSpawnInterval,
    } = config;
    const totalCells = width * height;
    const steelBlocks = Math.round(totalCells * config.SteelBlockFrequency);
    const woodenBlocks = Math.round(totalCells * config.WoodBlockFrequency);
    const oreBlocks = Math.round(totalCells * config.OreBlockFrequency);
    const worldGenerationOptions: IWorldGenerationOptions = {
        width,
        height,
        steelBlocks,
        woodenBlocks,
        oreBlocks,
        totalAgents: config.TotalAgents,
        isSymmetricalMap: config.IsSymmetricalMapEnabled,
    };

    const mersenneTwisterWorld = new MersenneTwister(worldSeed);
    const prngWorld: PRNG = () => mersenneTwisterWorld.random();

    const mersenneTwisterGame = new MersenneTwister(gameSeed);
    const prngGame: PRNG = () => mersenneTwisterGame.random();

    const gameTicker = new GameTicker(0, gameDurationTicks);

    const world = createWorldFromSeed(telemetry, config, prngWorld, prngGame, worldGenerationOptions, gameTicker);
    return new Game(telemetry, config, uuidv4(), gameTicker, world, tickRateHz, gameDurationTicks, fireSpawnInterval);
};
