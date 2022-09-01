import { EntityType, IGameState } from "@coderone/bomberland-library";

export const mock4x4GameState: Omit<IGameState, "connection"> = {
    game_id: "test",
    agents: { a: { agent_id: "a", unit_ids: ["a"] }, b: { agent_id: "b", unit_ids: ["b"] } },
    unit_state: {
        a: {
            coordinates: [2, 3],
            hp: 3,
            inventory: {
                bombs: 3,
            },
            blast_diameter: 3,
            unit_id: "a",
            agent_id: "a",
            invulnerable: 0,
            stunned: 0,
        },
        b: {
            coordinates: [1, 0],
            hp: 3,
            inventory: {
                bombs: 3,
            },
            blast_diameter: 3,
            unit_id: "b",
            agent_id: "b",
            invulnerable: 0,
            stunned: 0,
        },
    },
    entities: [
        {
            x: 3,
            y: 0,
            type: EntityType.MetalBlock,
            created: 1,
        },
        {
            x: 3,
            y: 1,
            type: EntityType.MetalBlock,
            created: 1,
        },
        {
            x: 0,
            y: 2,
            type: EntityType.MetalBlock,
            created: 1,
        },
        {
            x: 2,
            y: 2,
            type: EntityType.MetalBlock,
            created: 1,
        },
        {
            hp: 1,
            x: 1,
            y: 1,
            type: EntityType.WoodBlock,
            created: 1,
        },
        {
            hp: 1,
            x: 2,
            y: 1,
            type: EntityType.WoodBlock,
            created: 1,
        },
        {
            hp: 1,
            x: 3,
            y: 3,
            type: EntityType.WoodBlock,
            created: 1,
        },
        {
            hp: 1,
            x: 3,
            y: 2,
            type: EntityType.WoodBlock,
            created: 1,
        },
        {
            hp: 3,
            x: 1,
            y: 2,
            type: EntityType.OreBlock,
            created: 1,
        },
    ],
    world: {
        width: 4,
        height: 4,
    },
    tick: 1,
    config: {
        tick_rate_hz: 10,
        game_duration_ticks: 1800,
        fire_spawn_interval_ticks: 5,
    },
};
