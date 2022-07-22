import MersenneTwister from "mersenne-twister";
import { AgentMovePacket, PacketType, UnitMove } from "@coderone/bomberland-library";
import { getConfig } from "../../Config/getConfig";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { Telemetry } from "../../Services/Telemetry";
import { Unit } from "../Unit/Unit";
import { UnitTracker } from "./../Entity/World/UnitTracker";
import { getFilteredSameCellActions } from "./getFilteredSameCellActions";
import { PRNG } from "../Probability/Probability.types";

describe("removeSameCellMoveActions", () => {
    test(`it should leave an empty queue unchanged`, () => {
        const twister = new MersenneTwister();
        const prngGame: PRNG = () => twister.random();
        const moveActions: Array<[string, AgentMovePacket]> = [];
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("", config, false, "");
        const filtered = getFilteredSameCellActions(new Telemetry(engineTelemetry), moveActions, new UnitTracker(prngGame), 5);
        const result: Array<[string, AgentMovePacket]> = [];
        expect(result).toStrictEqual(filtered);
    });

    test(`it should remove actions where two agents are trying to move to the same cell`, () => {
        const config = getConfig();
        const unitC = new Unit(config, [0, 0], 5, "a", "c", 0, 1, 0, 0, 0);
        const unitD = new Unit(config, [2, 0], 5, "b", "d", 0, 1, 0, 0, 0);
        const twister = new MersenneTwister();
        const prngGame: PRNG = () => twister.random();
        const unitIdMapping = new UnitTracker(prngGame);
        unitIdMapping.Set(unitC);
        unitIdMapping.Set(unitD);
        const moveActions: Array<[string, AgentMovePacket]> = [
            [unitC.AgentId, { type: PacketType.Move, move: UnitMove.Right, unit_id: unitC.UnitId }],
            [unitD.AgentId, { type: PacketType.Move, move: UnitMove.Left, unit_id: unitD.UnitId }],
        ];
        const engineTelemetry = new CoderOneApi("", config, false, "");
        const filtered = getFilteredSameCellActions(new Telemetry(engineTelemetry), moveActions, unitIdMapping, 5);
        const result: Array<[string, AgentMovePacket]> = [];
        expect(result).toStrictEqual(filtered);
    });
});
