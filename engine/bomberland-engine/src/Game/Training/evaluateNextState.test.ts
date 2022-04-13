import { AgentPacket, EntityType, GameEventType, PacketType, UnitMove } from "@coderone/bomberland-library";
import { CoderOneApi } from "../../Services/CoderOneApi/CoderOneApi";
import { evaluateNextState, INextState } from "./evaluateNextState";
import { mock15x15gameState } from "./mock15x15gameState";
import { mock4x4GameState } from "../../mocks/mock4x4GameState";
import { Telemetry } from "../../Services/Telemetry";
import { mock2x2NoUnitGameState } from "../../mocks/mock2x2NoUnitGameState";
import { getConfig } from "../../Config/getConfig";
const config = getConfig();
const engineTelemetry = new CoderOneApi("test", config, false, "dev");
const telemetry = new Telemetry(engineTelemetry, false);

describe("evaluateNextState", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
    });

    test(`it should correctly evaluate the next state given an existing state and empty agent actions`, async () => {
        const state = await evaluateNextState(telemetry, mock4x4GameState, []);
        const result: INextState = {
            next_state: { ...mock4x4GameState, tick: mock4x4GameState.tick + 1 },
            is_complete: false,
            tick_result: { events: [], tick: 2 },
        };
        expect(result).toStrictEqual(state);
    });

    test(`it should correctly evaluate the next state given an existing state and some agent actions`, async () => {
        const forwardActions: Array<{
            readonly agent_id: string;
            readonly action: AgentPacket;
        }> = [];
        forwardActions.push({
            action: {
                type: PacketType.Move,
                move: UnitMove.Left,
                unit_id: "a",
            },
            agent_id: "a",
        });
        forwardActions.push({
            action: {
                type: PacketType.Move,
                move: UnitMove.Left,
                unit_id: "b",
            },
            agent_id: "b",
        });
        const state = await evaluateNextState(telemetry, mock4x4GameState, forwardActions);
        const unitStateA = mock4x4GameState.unit_state.a;
        const unitStateB = mock4x4GameState.unit_state.b;
        const result: INextState = {
            next_state: {
                ...mock4x4GameState,
                unit_state: {
                    a: { ...unitStateA, coordinates: [1, 3] },
                    b: { ...unitStateB, coordinates: [0, 0] },
                },
                tick: mock4x4GameState.tick + 1,
            },
            is_complete: false,
            tick_result: {
                events: [
                    {
                        agent_id: "a",
                        data: {
                            move: UnitMove.Left,
                            type: PacketType.Move,
                            unit_id: "a",
                        },
                        type: GameEventType.UnitAction,
                    },
                    {
                        agent_id: "b",
                        data: {
                            move: UnitMove.Left,
                            type: PacketType.Move,
                            unit_id: "b",
                        },
                        type: GameEventType.UnitAction,
                    },
                ],
                tick: 2,
            },
        };
        expect(result).toStrictEqual(state);
    });

    test(`it should correctly evaluate the next state given an existing state and empty agent actions`, async () => {
        const state = await evaluateNextState(telemetry, mock15x15gameState, []);
        const result: INextState = {
            next_state: { ...mock15x15gameState, tick: mock15x15gameState.tick + 1 },
            is_complete: false,
            tick_result: { events: [], tick: 719 },
        };
        expect(result).toStrictEqual(state);
    });

    test(`it should correctly evaluates state when there is a spawn event triggered right after blast spawn and there is no available space`, async () => {
        process.env["ENTITY_SPAWN_PROBABILITY_PER_TICK"] = "1";
        process.env["MAP_WIDTH"] = "2";
        process.env["MAP_HEIGHT"] = "2";
        const result = await evaluateNextState(telemetry, mock2x2NoUnitGameState, []);
        const expected: INextState = {
            next_state: {
                ...mock2x2NoUnitGameState,
                tick: mock2x2NoUnitGameState.tick + 1,
                entities: [
                    {
                        x: 0,
                        y: 0,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 1,
                        y: 0,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 1,
                        y: 1,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 0,
                        y: 1,
                        type: EntityType.Blast,
                        created: 100,
                    },
                ],
            },
            is_complete: true,
            tick_result: {
                events: [{ data: { created: 100, type: EntityType.Blast, x: 0, y: 1 }, type: GameEventType.EntitySpawned }],
                tick: mock2x2NoUnitGameState.tick + 1,
            },
        };
        expect(result).toStrictEqual(expected);
    });

    test(`it should correctly evaluates state when there is a spawn right before fire spread event`, async () => {
        process.env["AMMO_SPAWN_WEIGHTING"] = "1.0";
        process.env["BLAST_POWERUP_SPAWN_WEIGHTING"] = "0.0";
        process.env["ENTITY_SPAWN_PROBABILITY_PER_TICK"] = "1";
        process.env["MAP_WIDTH"] = "2";
        process.env["MAP_HEIGHT"] = "2";
        const tickOverride = 98;
        const result = await evaluateNextState(telemetry, { ...mock2x2NoUnitGameState, tick: tickOverride }, []);
        const expectedState1: INextState = {
            next_state: {
                ...mock2x2NoUnitGameState,
                tick: tickOverride + 1,
                entities: [
                    {
                        x: 0,
                        y: 0,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 1,
                        y: 0,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 1,
                        y: 1,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 0,
                        y: 1,

                        type: EntityType.Ammo,
                        created: 99,
                        hp: 1,
                        expires: 139,
                    },
                ],
            },
            is_complete: true,
            tick_result: {
                events: [
                    { data: { created: 99, expires: 139, hp: 1, type: EntityType.Ammo, x: 0, y: 1 }, type: GameEventType.EntitySpawned },
                ],
                tick: tickOverride + 1,
            },
        };
        expect(result).toStrictEqual(expectedState1);
        const result2 = await evaluateNextState(telemetry, expectedState1.next_state, []);
        const expectedState2: INextState = {
            ...expectedState1,
            next_state: {
                ...expectedState1.next_state,
                tick: tickOverride + 2,
                entities: [
                    {
                        x: 0,
                        y: 0,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 1,
                        y: 0,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 1,
                        y: 1,
                        type: EntityType.Ammo,
                        created: 98,
                        hp: 1,
                        expires: 138,
                    },
                    {
                        x: 0,
                        y: 1,

                        type: EntityType.Blast,
                        created: 100,
                    },
                ],
            },
            tick_result: {
                events: [
                    { data: [0, 1], type: GameEventType.EntityExpired },
                    { data: { created: 100, type: EntityType.Blast, x: 0, y: 1 }, type: GameEventType.EntitySpawned },
                ],
                tick: tickOverride + 2,
            },
        };

        expect(result2).toStrictEqual(expectedState2);
    });
});
