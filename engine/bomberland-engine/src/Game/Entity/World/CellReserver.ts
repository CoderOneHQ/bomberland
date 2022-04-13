import { getCoordinatesFromCellNumber } from "@coderone/bomberland-library";
import { PRNG } from "../../Probability/Probability.types";
import { Utilities } from "../../../Utilities";

export class CellReserver {
    public get FreeCells() {
        return this.freeCells;
    }
    public get ReservedCells() {
        return this.reservedCells;
    }

    private freeCells: Array<number>;
    private reservedCells: Set<number> = new Set();

    public constructor(totalCells: number, private prng: PRNG, private mapWidth: number) {
        const shuffledCellNumbers = Utilities.Shuffle<number>(Array.from(Array(totalCells).keys()), this.prng);
        this.freeCells = shuffledCellNumbers;
    }

    public ReserveRandomEmptyCell = (agentCellNumbers?: Set<number>): number | undefined => {
        if (agentCellNumbers !== undefined) {
            const emptyIndex = this.freeCells.findIndex((cellNum) => {
                return agentCellNumbers.has(cellNum) === false;
            });
            const emptyCellFound = emptyIndex !== -1;
            const availableCellNumber = emptyCellFound ? this.freeCells[emptyIndex] : undefined;
            return this.reserveExactCellNumber(availableCellNumber);
        }
        const cell = this.freeCells.pop();
        this.trackReserved(cell);
        return cell;
    };

    public FreeCell = (cellNumber: number) => {
        const length = this.freeCells.length;
        const index = Math.floor(this.prng() * length);
        this.freeCells.splice(index, 0, cellNumber);
        this.reservedCells.delete(cellNumber);
    };

    public ReadNonMiddleCell = (): number | undefined => {
        const middleCellX = Math.ceil(this.mapWidth / 2) - 1;
        const index = this.freeCells.findIndex((value) => {
            const [x] = getCoordinatesFromCellNumber(value, this.mapWidth);
            return x !== middleCellX;
        });
        const wasCellFound = index !== -1;
        if (wasCellFound) {
            const nonMiddleCellNumber = this.freeCells[index];
            return nonMiddleCellNumber;
        }
        return undefined;
    };

    public ReserveAvailableCellNumber = (cellNumber?: number): number | undefined => {
        if (cellNumber !== undefined) {
            const index = this.freeCells.indexOf(cellNumber);
            const wasFound = index !== -1;
            const cell = wasFound ? this.freeCells.splice(index, 1)[0] : undefined;
            this.trackReserved(cell);
            return cell;
        }
        const cell = this.freeCells.pop();
        this.trackReserved(cell);

        return cell;
    };

    public IsCellAvailable = (cellNumber: number): boolean => {
        return this.reservedCells.has(cellNumber) === false;
    };

    public ReadRandomEmptyCell = (): number | undefined => {
        const length = this.freeCells.length;
        if (length > 0) {
            return this.freeCells[length - 1];
        }
    };

    private reserveExactCellNumber = (cellNumber?: number): number | undefined => {
        if (cellNumber !== undefined) {
            const index = this.freeCells.indexOf(cellNumber);
            const wasFound = index !== -1;
            if (wasFound) {
                const cell = this.freeCells.splice(index, 1)[0];
                this.trackReserved(cell);
                return cell;
            }
        } else {
            return undefined;
        }
    };

    private trackReserved = (cell: number | undefined) => {
        if (cell !== undefined) {
            this.reservedCells.add(cell);
        }
    };
}
