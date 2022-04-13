import { getCellNumberFromCoordinates } from "@coderone/bomberland-library";

enum Direction {
    Down,
    Left,
    Up,
    Right,
}

class ClockWiseSpiraller {
    private totalCells = this.width * this.height;
    constructor(
        private width: number,
        private height: number,
        private usedCells: Set<number>,
        private currentDirection: Direction,
        private x: number,
        private y: number
    ) {
        const cellNumber = getCellNumberFromCoordinates([x, y], width);
        this.usedCells.add(cellNumber);
    }

    public FillNext = () => {
        if (this.usedCells.size < this.totalCells) {
            const [nextX, nextY] = this.getCoordinateFromDirection(this.currentDirection);
            const nextIsValid = this.isCoordinateValidNextMove(nextX, nextY);
            if (nextIsValid === false) {
                this.changeDirection();
            }
            this.moveNext();
        }
    };

    private moveNext = () => {
        const [nextX, nextY] = this.getCoordinateFromDirection(this.currentDirection);
        this.x = nextX;
        this.y = nextY;
        const cellNumber = getCellNumberFromCoordinates([nextX, nextY], this.width);
        this.usedCells.add(cellNumber);
    };

    private isCoordinateValidNextMove = (x: number, y: number): boolean => {
        const cellNumber = getCellNumberFromCoordinates([x, y], this.width);
        const cellIsUsed = this.usedCells.has(cellNumber);
        const isOutOfBounds = x < 0 || x >= this.width || y < 0 || y >= this.height;
        return cellIsUsed === false && isOutOfBounds === false;
    };

    private getCoordinateFromDirection = (direction: Direction): [number, number] => {
        switch (direction) {
            case Direction.Right:
                return [this.x + 1, this.y];
            case Direction.Down:
                return [this.x, this.y - 1];
            case Direction.Left:
                return [this.x - 1, this.y];
            case Direction.Up:
                return [this.x, this.y + 1];
            default:
                throw Error(`Invalid direction: ${direction}`);
        }
    };

    private changeDirection = (): void => {
        switch (this.currentDirection) {
            case Direction.Right:
                this.currentDirection = Direction.Down;
                break;
            case Direction.Down:
                this.currentDirection = Direction.Left;
                break;
            case Direction.Left:
                this.currentDirection = Direction.Up;
                break;
            case Direction.Up:
                this.currentDirection = Direction.Right;
                break;
            default:
                throw Error(`Invalid direction: ${this.currentDirection}`);
        }
    };
}

export const generateGrowingFireProgression = (width: number, height: number) => {
    const usedCells = new Set<number>();
    const totalCells = width * height;
    const spiralTopLeft = new ClockWiseSpiraller(width, height, usedCells, Direction.Right, 0, height - 1);
    const spiralBottomRight = new ClockWiseSpiraller(width, height, usedCells, Direction.Left, width - 1, 0);
    for (let i = 0; i < totalCells; i++) {
        spiralTopLeft.FillNext();
        spiralBottomRight.FillNext();
    }
    return Array.from(usedCells.values());
};
