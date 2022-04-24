import * as React from "react";
import { Cell } from "./Cell/Cell";

interface IProps {
    readonly width: number;
    readonly height: number;
}

export const Board: React.FC<IProps> = ({ width, height }) => {
    const totalCells = width * height;

    return (
        <>
            {Array.from(Array(totalCells).keys()).map((cellNumber) => (
                <Cell key={cellNumber} x={cellNumber % width} y={Math.floor(cellNumber / width)} width={width} height={height} />
            ))}
        </>
    );
};
