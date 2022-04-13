import { AgentMovePacket, PacketType, UnitMove } from "@coderone/bomberland-library";
import { getConfig } from "../../Config/getConfig";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { Telemetry } from "../../Services/Telemetry";
import { Unit } from "../Unit/Unit";
import { getFilteredSameCellActions } from "./getFilteredSameCellActions";

describe("removeSameCellMoveActions", () => {
    test(`it should leave an empty queue unchanged`, () => {
        const moveActions: Array<[string, AgentMovePacket]> = [];
        const config = getConfig();
        const engineTelemetry = new CoderOneApi("", config, false, "");
        const filtered = getFilteredSameCellActions(new Telemetry(engineTelemetry), moveActions, new Map<string, Unit>(), 5);
        const result: Array<[string, AgentMovePacket]> = [];
        expect(result).toStrictEqual(filtered);
    });

    test(`it should remove actions where two agents are trying to move to the same cell`, () => {
        const config = getConfig();
        const unitC = new Unit(config, [0, 0], 5, "a", "c", 0, 1, 0, 0);
        const unitD = new Unit(config, [2, 0], 5, "b", "d", 0, 1, 0, 0);
        const unitIdMapping = new Map<string, Unit>();
        unitIdMapping.set(unitC.UnitId, unitC);
        unitIdMapping.set(unitD.UnitId, unitD);
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
