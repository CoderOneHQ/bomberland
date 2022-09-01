import { createGameFromState } from "./createGameFromState";
import { mock4x4GameState } from "../../mocks/mock4x4GameState";
import { mock9x9GameState } from "../../mocks/mock9x9GameState";
import { Telemetry } from "../../Services/Telemetry";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { mock15x15gameState } from "../Training/mock15x15gameState";
import { getConfig } from "../../Config/getConfig";

describe("createGameFromState", () => {
    test(`it should recreate a game from an 9x9 IGameState object and reproduce the same gamestate for 9x9 state`, () => {
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("test", config, false, "dev");
        const telemetry = new Telemetry(engineTelemetry, false);
        const game = createGameFromState(telemetry, mock9x9GameState);
        const result = game.GetCurrentGameState();
        expect(result).toStrictEqual(mock9x9GameState);
    });

    test(`it should recreate a game from an 4x4 IGameState object and reproduce the same gamestate for 9x9 state`, () => {
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("test", config, false, "dev");
        const telemetry = new Telemetry(engineTelemetry, false);
        const game = createGameFromState(telemetry, mock4x4GameState);
        const result = game.GetCurrentGameState();
        expect(result).toStrictEqual(mock4x4GameState);
    });

    test(`it should recreate a game from an 15x15 IGameState object and reproduce the same gamestate for 9x9 state`, () => {
        process.env["BOMB_DURATION_TICKS"] = "40";
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("test", config, false, "dev");
        const telemetry = new Telemetry(engineTelemetry, false);
        const game = createGameFromState(telemetry, mock15x15gameState);
        const result = game.GetCurrentGameState();
        expect(result).toStrictEqual(mock15x15gameState);
    });
});
