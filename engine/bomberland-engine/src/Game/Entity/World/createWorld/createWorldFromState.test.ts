import { GameTicker } from "../../../Game/GameTicker";
import { generateWorldFromState } from "./createWorldFromState";
import { mockWorldState } from "../../../../mocks/mockWorldState";
import { Telemetry } from "../../../../Services/Telemetry";
import { CoderOneApi } from "../../../../Services/CoderOneApi/CoderOneApi";
import { mock6x6InvalidGameState } from "../../../../mocks/mock6x6InvalidGameState";
import { getConfig } from "../../../../Config/getConfig";

describe("createWorldFromState", () => {
    test(`it should recreate a world from a worldstate and reproduce the same worldstate`, () => {
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("test", config, false, "dev");
        const telemetry = new Telemetry(engineTelemetry, false);
        const gameState = mockWorldState;
        const gameTicker = new GameTicker(0, 1800);
        const world = generateWorldFromState(telemetry, gameState, 9, 9, gameTicker);
        const result = world.WorldState;
        expect(result).toStrictEqual(gameState);
    });

    test(`it should fail to recreate a world where there are multiple entities occupying the same cell`, () => {
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("test", config, false, "dev");
        const telemetry = new Telemetry(engineTelemetry, false);
        const gameTicker = new GameTicker(0, 300);
        expect(() => {
            generateWorldFromState(telemetry, mock6x6InvalidGameState, 6, 6, gameTicker);
        }).toThrow();
    });
});
