import { UnitTracker } from "./../../UnitTracker";
import { Unit } from "../../../../Unit/Unit";
import { EmptyCellTracker } from "../../EmptyCellTracker";
import { getCoordinatesFromCellNumber } from "@coderone/bomberland-library";
import { IdCounter } from "./IdCounter";
import { IConfig } from "../../../../../Config/IConfig";

const placeUnit = (config: IConfig, width: number, unitTracker: UnitTracker, agentId: string, counter: IdCounter, cellNumber: number) => {
    const unitId = counter.NextId;
    const coordinates = getCoordinatesFromCellNumber(cellNumber, width);
    const unit = new Unit(
        config,
        coordinates,
        width,
        agentId,
        unitId,
        config.InitialAmmunition,
        config.InitialHP,
        config.InitialBlastDiameter,
        0,
        0
    );
    unitTracker.Set(unit);
};

/**
 * Places units and reserves free "breathing" space around their spawn positions.
 * REMARKS: Should be called before placing other entities to ensure there is free space to move
 */
export const placeUnits = (
    config: IConfig,
    unitTracker: UnitTracker,
    emptyCellTracker: EmptyCellTracker,
    totalAgents: number,
    width: number,
    isSymmetricalMap: boolean
) => {
    const counter = new IdCounter();
    if (isSymmetricalMap) {
        if (totalAgents !== 2) {
            throw new Error("Symmetrical maps only supports two agents");
        }

        const pairsOfUnitsToPlace = (config.UnitsPerAgent * totalAgents) / 2;
        const agentIdA = counter.NextId;
        const agentIdB = counter.NextId;
        for (let i = 0; i < pairsOfUnitsToPlace; i++) {
            const reservationPair = emptyCellTracker.ReserveRandomAgentReflectedCellPair();
            if (reservationPair !== undefined) {
                const [agentCellA, agentCellB] = reservationPair;
                placeUnit(config, width, unitTracker, agentIdA, counter, agentCellA);
                placeUnit(config, width, unitTracker, agentIdB, counter, agentCellB);
            } else {
                throw new Error("Empty reservation pair");
            }
        }
    } else {
        for (let i = 0; i < totalAgents; i++) {
            const agentId = counter.NextId;
            const randomUnassignedCellNumber = emptyCellTracker.ReserveRandomEmptyCell();
            if (randomUnassignedCellNumber !== undefined) {
                placeUnit(config, width, unitTracker, agentId, counter, randomUnassignedCellNumber);
            }
        }
    }

    if (unitTracker.Size <= 0) {
        throw new Error("No agents were instantiated probably due to invalid world configuration");
    }
};
