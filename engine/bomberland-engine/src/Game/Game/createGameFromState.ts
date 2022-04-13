import { Game } from "./Game";
import { GameTicker } from "./GameTicker";
import { generateWorldFromState } from "../Entity/World/createWorld/createWorldFromState";
import { IGameState, IUnitState } from "@coderone/bomberland-library";
import { IWorldState } from "../Entity/World/World";
import { Telemetry } from "../../Services/Telemetry";
import { getConfig } from "../../Config/getConfig";

export const createGameFromState = (telemetry: Telemetry, gameState: Omit<IGameState, "connection">): Game => {
    const { tick, game_id } = gameState;
    const { width, height } = gameState.world;
    const { tick_rate_hz, game_duration_ticks, fire_spawn_interval_ticks } = gameState.config;
    const config = getConfig({ MapWidth: width, MapHeight: height });

    const gameTicker = new GameTicker(tick, game_duration_ticks);

    const units: Array<IUnitState> = Object.keys(gameState.unit_state).map((unitId) => {
        return gameState.unit_state[unitId];
    });
    const worldState: IWorldState = { units: units, entities: gameState.entities };

    const world = generateWorldFromState(telemetry, worldState, width, height, gameTicker);
    return new Game(telemetry, config, game_id, gameTicker, world, tick_rate_hz, game_duration_ticks, fire_spawn_interval_ticks);
};
