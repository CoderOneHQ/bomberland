import { AmmoEntity } from "./../AmmoEntity";
import { getConfig } from "../../../Config/getConfig";
import { BombEntity } from "./../BombEntity";
import { EntityTracker } from "./EntityTracker";

describe("EntityTracker", () => {
    test(`it can create an new tracker and have no entities`, () => {
        const result = new EntityTracker().Entities;
        expect(result).toStrictEqual([]);
    });

    test(`it can add, get and remove an entity`, () => {
        const entityTracker = new EntityTracker();
        const config = getConfig();
        const bomb = new BombEntity(config, 1, 1, "a", "a", 0, 4);
        entityTracker.Add(bomb);
        const addResult = entityTracker.Entities;
        expect(addResult).toStrictEqual([bomb]);

        const getResult = entityTracker.Get(bomb.CellNumber);
        expect(getResult).toStrictEqual(bomb);

        entityTracker.Remove(bomb.CellNumber);
        const removeResult = entityTracker.Entities;
        expect(removeResult).toStrictEqual([]);
    });

    test(`active bomb count by agent returns the correct count when bomb are added and removed`, () => {
        const config = getConfig();
        const entityTracker = new EntityTracker();
        const mockAgentId = "mock-agent-id";
        const mockUnitId = "mock-unit-id";

        expect(entityTracker.ActiveBombCountByAgent(mockAgentId)).toStrictEqual(0);

        const bomb = new BombEntity(config, 1, 1, mockUnitId, mockAgentId, 0, 4);
        entityTracker.Add(bomb);

        expect(entityTracker.ActiveBombCountByAgent(mockAgentId)).toStrictEqual(1);

        entityTracker.Remove(bomb.CellNumber);

        expect(entityTracker.ActiveBombCountByAgent(mockAgentId)).toStrictEqual(0);
    });

    test(`active bomb count by agent returns zero count when non-bombs are added and removed`, () => {
        const config = getConfig();
        const entityTracker = new EntityTracker();
        const mockAgentId = "mock-agent-id";

        expect(entityTracker.ActiveBombCountByAgent(mockAgentId)).toStrictEqual(0);

        const ammunition = new AmmoEntity(config, 1, 1);
        entityTracker.Add(ammunition);

        expect(entityTracker.ActiveBombCountByAgent(mockAgentId)).toStrictEqual(0);

        entityTracker.Remove(ammunition.CellNumber);

        expect(entityTracker.ActiveBombCountByAgent(mockAgentId)).toStrictEqual(0);
    });
});
