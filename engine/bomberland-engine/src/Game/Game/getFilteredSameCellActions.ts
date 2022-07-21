import { AgentMovePacket, getCellNumberFromCoordinates, UnitMove } from "@coderone/bomberland-library";
import { Telemetry } from "../../Services/Telemetry";
import { UnitTracker } from "./../Entity/World/UnitTracker";

const getDeltaCoordinates = (move: UnitMove): [number, number] => {
    switch (move) {
        case UnitMove.Down:
            return [0, -1];

        case UnitMove.Up:
            return [0, 1];

        case UnitMove.Left:
            return [-1, 0];

        case UnitMove.Right:
            return [1, 0];
        default:
            throw new Error(`Unknown move: ${move}`);
    }
};

const getTargetCell = (originCoordinates: [number, number], move: UnitMove, worldWidth: number): number => {
    const delta = getDeltaCoordinates(move);
    const [dX, dY] = delta;
    const [oX, oY] = originCoordinates;
    return getCellNumberFromCoordinates([oX + dX, oY + dY], worldWidth);
};

/**
 * Removes actions where multiple agents are trying to go to the same cell
 */
export const getFilteredSameCellActions = (
    telemetry: Telemetry,
    moveActions: Array<[string, AgentMovePacket]>,
    unitTracker: UnitTracker,
    worldWidth: number
): Array<[string, AgentMovePacket]> => {
    const targetedCells = new Map<number, Set<string>>();
    const blockedUnitIds = new Set<string>();
    moveActions.forEach((action) => {
        const [, agentPacket] = action;
        const { move, unit_id } = agentPacket;
        const unit = unitTracker.GetUnitById(unit_id);
        if (unit === undefined) {
            throw new Error(`Unit ${unit_id} in moveActions not found`);
        }
        const targetCell = getTargetCell(unit.Coordinates, move, worldWidth);
        const mapValue = targetedCells.get(targetCell);
        const unitIds = mapValue ?? new Set<string>();
        unitIds.add(unit_id);
        if (mapValue === undefined) {
            targetedCells.set(targetCell, unitIds);
        }
    });

    targetedCells.forEach((unitIdSet) => {
        if (unitIdSet.size > 1) {
            unitIdSet.forEach((unitId) => {
                blockedUnitIds.add(unitId);
            });
        }
    });

    const filteredActions = moveActions.filter((action) => {
        const [, agentPacket] = action;
        const { unit_id } = agentPacket;
        if (blockedUnitIds.has(unit_id)) {
            telemetry.Info(
                `Multiple units attempting to move to same cell, unit ${unit_id} blocked from moving, dropping move ${JSON.stringify(
                    agentPacket
                )}`
            );
            return false;
        }
        return true;
    });

    return filteredActions;
};
