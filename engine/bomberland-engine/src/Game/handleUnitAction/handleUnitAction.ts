import { Unit } from "../Unit/Unit";
import { UnitMove, AgentMovePacket, AgentPacket, EntityType, getCellNumberFromCoordinates, PacketType } from "@coderone/bomberland-library";
import { BlastEntity } from "../Entity/BlastEntity";
import { GameTicker } from "../Game/GameTicker";
import { Telemetry } from "../../Services/Telemetry";
import { World } from "../Entity/World/World";
import { IConfig } from "../../Config/IConfig";

const moveUp = (unit: Unit, world: World) => {
    const [x, y] = unit.Coordinates;
    const newY = y + 1;
    const isVacant = world.IsCoordinateVacant(x, newY) && world.DoesCoordinateContainAgent([x, newY]) === false;
    if (isVacant === false) {
        throw Error("Cannot move up, cell is not vacant");
    }
    world.OnUnitMove(unit.Coordinates, [x, newY]);
    unit.SetCoordinates(x, newY);
};

const moveDown = (unit: Unit, world: World) => {
    const [x, y] = unit.Coordinates;
    const newY = y - 1;
    const isVacant = world.IsCoordinateVacant(x, newY) && world.DoesCoordinateContainAgent([x, newY]) === false;
    if (isVacant === false) {
        throw Error("Cannot move down, cell is not vacant");
    }
    world.OnUnitMove(unit.Coordinates, [x, newY]);
    unit.SetCoordinates(x, newY);
};

const moveLeft = (unit: Unit, world: World) => {
    const [x, y] = unit.Coordinates;
    const newX = x - 1;
    const isVacant = world.IsCoordinateVacant(newX, y) && world.DoesCoordinateContainAgent([newX, y]) === false;
    if (isVacant === false) {
        throw Error("Cannot move left, cell is not vacant");
    }
    world.OnUnitMove(unit.Coordinates, [newX, y]);
    unit.SetCoordinates(newX, y);
};

const moveRight = (unit: Unit, world: World) => {
    const [x, y] = unit.Coordinates;
    const newX = x + 1;
    const isVacant = world.IsCoordinateVacant(newX, y) && world.DoesCoordinateContainAgent([newX, y]) === false;
    if (isVacant === false) {
        throw Error("Cannot move right, cell is not vacant");
    }
    world.OnUnitMove(unit.Coordinates, [newX, y]);
    unit.SetCoordinates(newX, y);
};

const placeBomb = (unit: Unit, world: World, gameTicker: GameTicker, config: IConfig) => {
    const bombCount = unit.State.inventory.bombs;
    if (bombCount <= 0) {
        throw new Error("No bombs in inventory.");
    }
    const cellNumber = unit.CellNumber;

    const entityInCell = world.GetEntityInCell(cellNumber);
    if (entityInCell === undefined) {
        world.PlaceBomb(cellNumber, unit.State.unit_id);
    } else if (entityInCell.Type === EntityType.Blast) {
        const newExpiry = entityInCell.Expires !== undefined ? gameTicker.CurrentTick + config.BlastDurationTicks : undefined;
        const newUnitId = entityInCell.Expires !== undefined ? entityInCell.UnitId : undefined;
        const newAgentId = entityInCell.Expires !== undefined ? entityInCell.AgentId : undefined;
        // TODO figure out how to clean this up:
        world.RemoveEntity(entityInCell.CellNumber);
        world.PlaceBomb(cellNumber, unit.State.unit_id);
        world.ExpireEntityInCell(cellNumber);
        world.ExpireEntityInCell(cellNumber);
        const blast = new BlastEntity(config, cellNumber, newUnitId, newAgentId, newExpiry, gameTicker.CurrentTick);
        world.PlaceEntity(blast);
    } else {
        throw new Error("Unable to place bomb already occupied");
    }
};

const detonateBomb = (unit: Unit, world: World, coordinates: [number, number], gameTicker: GameTicker, config: IConfig) => {
    const cellNumber = getCellNumberFromCoordinates(coordinates, world.Width);
    const entity = world.GetEntityInCell(cellNumber);
    if (entity !== undefined && entity.Type === EntityType.Bomb && entity.UnitId === unit.State.unit_id) {
        const currentTick = gameTicker.CurrentTick;
        const isBombArmed = currentTick - entity.Created > config.BombArmedTicks;
        if (isBombArmed) {
            world.ExpireEntity(entity);
        } else {
            throw new Error("Bomb not armed");
        }
    }
};

const onUnitMove = (telemetry: Telemetry, unit: Unit, world: World, action: AgentMovePacket) => {
    switch (action.move) {
        case UnitMove.Up:
            moveUp(unit, world);
            break;
        case UnitMove.Down:
            moveDown(unit, world);
            break;
        case UnitMove.Left:
            moveLeft(unit, world);
            break;
        case UnitMove.Right:
            moveRight(unit, world);
            break;
        default:
            telemetry.Error(`Agent recieved unknown action: ${action.type}`);
    }
};

export const handleUnitAction = (
    telemetry: Telemetry,
    action: AgentPacket,
    unit: Unit,
    world: World,
    gameTicker: GameTicker,
    config: IConfig
) => {
    switch (action.type) {
        case PacketType.Move:
            onUnitMove(telemetry, unit, world, action);
            break;
        case PacketType.Bomb:
            placeBomb(unit, world, gameTicker, config);
            break;
        case PacketType.Detonate:
            detonateBomb(unit, world, action.coordinates, gameTicker, config);
            break;
        default:
            telemetry.Error(`Agent recieved unhandled action: ${JSON.stringify(action)}`);
    }
};
