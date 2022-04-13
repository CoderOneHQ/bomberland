import { EntityType, GameEventType, IEntity, IEntityExpiredEvent } from "../..";
import { expireEntity } from "./expireEntity";

const generateEntitiesWithCoordinates = (coordinates: Array<[number, number]>) => {
    return coordinates.map((coord) => {
        const [x, y] = coord;
        return { type: EntityType.Bomb, x, y, created: 0 };
    });
};
describe("expireEntity", () => {
    test("It should not remove from empty entities", () => {
        const entities: Array<IEntity> = [];
        const event: IEntityExpiredEvent = { type: GameEventType.EntityExpired, data: [0, 0] };
        const result = expireEntity(event, entities);
        expect(result).toStrictEqual([]);
    });

    test("It should remove single entity", () => {
        const entities: Array<IEntity> = generateEntitiesWithCoordinates([[0, 0]]);
        const event: IEntityExpiredEvent = { type: GameEventType.EntityExpired, data: [0, 0] };
        const result = expireEntity(event, entities);
        expect(result).toStrictEqual([]);
    });

    test("It should not remove single entity", () => {
        const entities: Array<IEntity> = generateEntitiesWithCoordinates([[0, 0]]);
        const event: IEntityExpiredEvent = { type: GameEventType.EntityExpired, data: [1, 0] };
        const result = expireEntity(event, entities);
        expect(result).toStrictEqual(entities);
    });
});
