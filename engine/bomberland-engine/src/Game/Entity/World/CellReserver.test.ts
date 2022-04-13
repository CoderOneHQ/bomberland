import { CellReserver } from "./CellReserver";
import MersenneTwister from "mersenne-twister";

describe("CellReserver", () => {
    test(`it should not have any reserved cells upon instantiation`, () => {
        const twister = new MersenneTwister(1);
        const prng = () => {
            return twister.random();
        };
        const cellReserver = new CellReserver(9 * 9, prng, 9);
        const result = cellReserver.ReservedCells.size;
        expect(result).toStrictEqual(0);
    });

    test(`FreeCells should contain all numbers upon instantiation`, () => {
        const twister = new MersenneTwister(1);
        const prng = () => {
            return twister.random();
        };
        const cellReserver = new CellReserver(9 * 9, prng, 9);
        expect(cellReserver.FreeCells.length).toStrictEqual(9 * 9);
        expect(cellReserver.FreeCells.sort((a, b) => a - b)).toStrictEqual(Array.from(Array(9 * 9).keys()));
    });

    test(`it should be able to reserve specific cells`, () => {
        const twister = new MersenneTwister(1);
        const prng = () => {
            return twister.random();
        };
        const reservations = [...Array(81).keys()];
        const reservedCells: Array<number> = [];
        const cellReserver = new CellReserver(9 * 9, prng, 9);
        reservations.forEach((cellNumber) => {
            const cell = cellReserver.ReserveAvailableCellNumber(cellNumber);
            expect(cell).toStrictEqual(cellNumber);
            expect(cellReserver.FreeCells.indexOf(cellNumber)).toStrictEqual(-1);
            if (cell !== undefined) {
                reservedCells.push(cell);
            }
        });
        const result = Array.from(cellReserver.ReservedCells);
        expect(cellReserver.ReservedCells.size).toStrictEqual(9 * 9);
        expect(cellReserver.FreeCells.length).toStrictEqual(0);
        expect(result).toStrictEqual(reservedCells);
        expect(result).toStrictEqual(reservations);
    });

    test(`it should be able to reserve random cells until full`, () => {
        const twister = new MersenneTwister(1);
        const prng = () => {
            return twister.random();
        };
        const reservations = [...Array(81).keys()];
        const reservedCells: Array<number> = [];
        const cellReserver = new CellReserver(9 * 9, prng, 9);
        reservations.forEach(() => {
            const cell = cellReserver.ReserveRandomEmptyCell();
            if (cell !== undefined) {
                reservedCells.push(cell);
            }
        });
        const result = Array.from(cellReserver.ReservedCells);
        expect(cellReserver.ReservedCells.size).toStrictEqual(9 * 9);
        expect(cellReserver.FreeCells.length).toStrictEqual(0);
        expect(result).toStrictEqual(reservedCells);
        expect(result.sort()).toStrictEqual(reservations.sort());
    });
});
