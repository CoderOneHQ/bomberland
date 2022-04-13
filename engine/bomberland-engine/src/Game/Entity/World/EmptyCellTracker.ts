import { CellReserver } from "./CellReserver";
import { getCellNumberFromCoordinates, getCoordinatesFromCellNumber } from "@coderone/bomberland-library";
import { horizontallyReflectCellNumber } from "./cellFunctions/horizontallyReflectCellNumber";
import { PRNG } from "../../Probability/Probability.types";
import { Utilities } from "../../../Utilities";
import { Telemetry } from "../../../Services/Telemetry";

// TODO extract reservation logic to own class which accepts cellTracker as a param as this class is too big
interface IAgentReservation {
    readonly agentCell: number;
    readonly reservedCells: Array<number>;
}

export class EmptyCellTracker {
    private isEvenWidth: boolean;
    private tmpAgentReservations: Array<IAgentReservation> = [];

    public constructor(
        private telemetry: Telemetry,
        private mapWidth: number,
        private mapHeight: number,
        private prng: PRNG,
        private cellReserver: CellReserver
    ) {
        this.isEvenWidth = mapWidth % 2 === 0;
    }

    public ReserveRandomEmptyCell = (agentCellNumbers?: Set<number>): number | undefined => {
        return this.cellReserver.ReserveRandomEmptyCell(agentCellNumbers);
    };

    public ReserveRandomReflectedCells = (): [number, number] | undefined => {
        const cell = this.getCellForReflectedReservation();
        if (cell === undefined) {
            this.telemetry.Warning("undefined cellNumber");
            return undefined;
        }
        const reflectedCell = horizontallyReflectCellNumber(this.mapWidth, cell);
        if (reflectedCell === undefined) {
            this.telemetry.Warning("undefined reflected cellNummber");
            return undefined;
        }
        this.cellReserver.ReserveAvailableCellNumber(cell);
        this.cellReserver.ReserveAvailableCellNumber(reflectedCell);
        return [cell, reflectedCell];
    };

    /**
     * Used to reserve cells while generating world to allow some safe moving space
     * REMARKS: must call ClearAgentReservations after all entities have been placed in the world
     * @returns IAgentReservation
     */
    public ReserveRandomAgentReflectedCellPair = (): [number, number] | undefined => {
        const cell = this.getCellForReflectedReservation();

        if (cell === undefined) {
            this.telemetry.Debug("Cell is undefined");
            return undefined;
        }

        const reservation = this.makeAgentReservation(cell);

        if (reservation === undefined) {
            this.telemetry.Debug("Reservation is empty");
            return undefined;
        }
        const reflectedReservation = this.reflectAgentReservation(reservation);
        if (reflectedReservation === undefined) {
            this.recycleReservation(reservation);
            this.telemetry.Debug("Reflected reservation is empty");
            return undefined;
        }
        this.tmpAgentReservations.push(reservation, reflectedReservation);
        return [reservation.agentCell, reflectedReservation.agentCell];
    };

    private getCellForReflectedReservation = () => {
        if (this.isEvenWidth) {
            return this.cellReserver.ReadRandomEmptyCell();
        } else {
            return this.cellReserver.ReadNonMiddleCell();
        }
    };

    public ClearAgentReservations = () => {
        this.tmpAgentReservations.forEach((reservation) => {
            this.recycleReservation(reservation);
        });
    };

    public makeAgentReservation = (cellNumber?: number): IAgentReservation | undefined => {
        const cell = this.cellReserver.ReserveAvailableCellNumber(cellNumber);
        if (cell === undefined) {
            this.telemetry.Debug(`Unable to reserve cell ${cellNumber}`);
            return undefined;
        }
        const paths = this.randomWalk(cell, 2);

        if (paths === undefined || paths.length <= 0) {
            return undefined;
        }
        const shuffledPaths = Utilities.Shuffle(paths, this.prng);
        const path = shuffledPaths.pop();
        if (path === undefined) {
            return undefined;
        }
        path.forEach((cellNumber) => {
            this.cellReserver.ReserveAvailableCellNumber(cellNumber);
        });
        return { agentCell: cell, reservedCells: path };
    };

    private getConnectedEmptyCells = (cellNumber: number) => {
        const [x, y] = getCoordinatesFromCellNumber(cellNumber, this.mapWidth);

        const results: Array<[number, number]> = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ];
        return results.filter(this.isValidEmptyCoordinate);
    };

    private isValidEmptyCoordinate = (coordinate: [number, number]): boolean => {
        const [x, y] = coordinate;
        const isOutOfBounds = x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight;
        if (isOutOfBounds) {
            return false;
        }
        const cellNumber = getCellNumberFromCoordinates(coordinate, this.mapWidth);
        return this.cellReserver.IsCellAvailable(cellNumber);
    };

    private randomWalk = (cellNode: number, maxDepth: number): Array<Array<number>> | undefined => {
        if (maxDepth === 0) {
            return [[cellNode]];
        }
        const results: Array<Array<number>> = [];
        const validConnectedCells = this.getConnectedEmptyCells(cellNode).map((coordinates) =>
            getCellNumberFromCoordinates(coordinates, this.mapWidth)
        );

        validConnectedCells.forEach((cell) => {
            const childPaths = this.randomWalk(cell, maxDepth - 1);
            if (childPaths?.length || 0 > 0) {
                childPaths?.forEach((path) => {
                    results.push([cellNode, ...path]);
                });
            }
        });
        return results;
    };

    private recycleReservation = (reservation: IAgentReservation) => {
        const { agentCell, reservedCells } = reservation;
        this.cellReserver.FreeCell(agentCell);
        reservedCells.forEach((cell) => {
            this.cellReserver.FreeCell(cell);
        });
    };

    private reflectAgentReservation = (reservation: IAgentReservation): IAgentReservation | undefined => {
        const { agentCell, reservedCells } = reservation;
        const reflectedReservedCells: Array<number> = [];

        const reflectedAgentCell = horizontallyReflectCellNumber(this.mapWidth, agentCell);
        if (reflectedAgentCell === undefined || this.cellReserver.IsCellAvailable(reflectedAgentCell) === false) {
            return undefined;
        }

        for (const cell of reservedCells) {
            const reflectedCell = horizontallyReflectCellNumber(this.mapWidth, cell);
            if (reflectedCell === undefined || this.cellReserver.IsCellAvailable(reflectedCell) === false) {
                return undefined;
            }
            reflectedReservedCells.push(reflectedCell);
        }
        this.cellReserver.ReserveAvailableCellNumber(reflectedAgentCell);
        reflectedReservedCells.forEach((cell) => {
            this.cellReserver.ReserveAvailableCellNumber(cell);
        });
        return { agentCell: reflectedAgentCell, reservedCells: reflectedReservedCells };
    };
}
