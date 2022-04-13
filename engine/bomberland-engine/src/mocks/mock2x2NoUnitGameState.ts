import { EntityType, IGameState } from "@coderone/bomberland-library";

export const mock2x2NoUnitGameState: Omit<IGameState, "connection"> = {
    game_id: "test",
    agents: {},
    unit_state: {},
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
    ],
    world: {
        width: 2,
        height: 2,
    },
    tick: 99,
    config: {
        tick_rate_hz: 10,
        game_duration_ticks: 100,
        fire_spawn_interval_ticks: 1,
    },
};
