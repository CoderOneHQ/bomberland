---
slug: "/docs/api-reference"
title: "API reference"
description: "Api reference for the Bomberland environment"
order: 3
---

## 🧩 Connection

Agents connect to the game server via websockets.

The provided [starter kits](https://github.com/CoderOneHQ/bomberland) will have this set up for you.

```bash
GAME_CONNECTION_STRING=ws://game-server:3000/?role=agent&agentId=agentId&name=python3-agent
```

### Roles

`role` can take one of the 3 following values:

-   `agent`- (Default) Connect as one of 2 agents that can send actions to the game server. If you connect as an agent via the game client, you can play as a human player.
-   `spectator` - can connect to the game to observe the game - usually through the game client.
-   `admin` - if the `TRAINING_MODE_ENABLED=1` environment flag is set (see [⚙️ Environment Flags](../docs/api-reference/#%EF%B8%8F-environment-flags)), agents in the admin role will be able to send admin packets that step through the game tick-by-tick (see the 'Request Tick' action in [🕹️ Action Packets](../docs/api-reference/#%EF%B8%8F-action-packets)).

`agentId` : specify either `agentA` or `agentB`.

`name`: (doesn't do anything right now)

## 🎮 Game State Definitions

Your agent receives information from the environment each tick as a JSON packet. In the starter kits, this packet is stored in `game_state`.

The first `game_state` your agent receives will contain a full state of the environment. Example:

```json
{
    "agents": {
        "a": {
            "agent_id": "a",
            "unit_ids": [
                "c",
                "e",
                "g"
            ]
        },
        "b": {
            "agent_id": "b",
            "unit_ids": [
                "d",
                "f",
                "h"
            ]
        }
    },
    "unit_state": {
    ...
    },
    "entities": [
        {
            "created": 0,
            "x": 11,
            "y": 7,
            "type": "m"
        },
        {
            "created": 0,
            "x": 12,
            "y": 4,
            "type": "o",
            "hp": 3
        }
    ],
    "world": {
        "width": 15,
        "height": 15
    },
    "tick": 0,
    "config": {
        "tick_rate_hz": 10,
        "game_duration_ticks": 1800,
        "fire_spawn_interval_ticks": 5
    },
    "connection": {
        "id": 1,
        "role": "agent",
        "agent_id": "b"
    }
}
```

After the first `game_state`, packets received from the server contain only the latest **updates** to the game environment. The provided starter kits handle the simulation logic and will return `game_state` in full for your agent. If you are building an agent from scratch, you will need to implement this simulation logic as well.

The following environment data is available from the game server:

### agents[agent_id]

(**Type**: object) Information for the given `agent_id`.

```json
"agents": {
    "a": {
        "agent_id": "a",
        "unit_ids": [
            "c",
            "e",
            "g"
        ]
    },
    "b": {
        "agent_id": "b",
        "unit_ids": [
            "d",
            "f",
            "h"
        ]
    }
}
```

| Property   | Type          | Description                              |
| ---------- | ------------- | ---------------------------------------- |
| `agent_id` | string        | Agent identifier (either a or b)         |
| `unit_ids` | Array<string> | List of unit IDs belonging to this agent |

### unit_state[unit_id]

(**Type**: object) Information for the given `unit_id`.

```json
"unit_state": {
    "c": {
        "coordinates": [
            3,
            10
        ],
        "hp": 3,
        "inventory": {
            "bombs": 3
        },
        "blast_diameter": 3,
        "unit_id": "c",
        "agent_id": "a",
        "invulnerable": 0,
        "stunned": 0
    }
```

| Property         | Type             | Description                                                                                                                                                                                                                                        |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `coordinates`    | [number, number] | [X, Y] location                                                                                                                                                                                                                                    |
| `hp`             | number           | Health points                                                                                                                                                                                                                                      |
| `inventory `     | object           | Items owned by unit (currently just ammunition)                                                                                                                                                                                                    |
| `bombs`          | number           | Number of bombs available to place (i.e. ammunition) <br /> E.g. to get ammunition for unit C: `game_state["unit_state"]["c"]["inventory"]["bombs"]` <br /> **NOTE (ver. 2204+):** the ammunition is effectively set to infinity for bomberlandv4. |
| `blast_diameter` | number           | Diameter of blast range for bombs placed by this unit                                                                                                                                                                                              |
| `unit_id`        | string           | This unit's identifier (valid IDs: `c`, `d`, `e`, `f`, `g`, `h`)                                                                                                                                                                                   |
| `agent_id`       | string           | The agent to which this unit belongs (either `a` or `b`)                                                                                                                                                                                           |
| `invulnerable`   | number           | Latest tick number after which this unit is no longer invulnerable (inclusive). <br> E.g. `"invulnerable": 60` → this unit is invulnerable until tick 60.                                                                                          |
| `stunned`        | number           | Latest tick number after which this unit is no longer stunned (inclusive). <br> E.g. `"stunned": 60` → this unit is stunned until tick 60.                                                                                                         |

### entities

(**Type**: array of objects) A list of entities (e.g. blocks, explosions) on the map. Does not include players/units. See [📦 Game Entities](../docs/api-reference/#-game-entities) for a full list of entities and how they will appear.

```json
"entities": [
    {
        "created": 60,
        "x": 3,
        "y": 9,
        "type": "b",
        "unit_id": "h",
        "expires": 100,
        "hp": 1,
        "blast_diameter": 3
    }
],
```

| Property         | Type                                                                               | Description                                                                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `created`        | number                                                                             | Tick on which this entity was created (0 = part of the initial world rendering)                                                                                                                       |
| `x`              | number                                                                             | x-coordinate                                                                                                                                                                                          |
| `y`              | number                                                                             | y-coordinate                                                                                                                                                                                          |
| `type`           | `a` &#124; `b` &#124; `x` &#124; `bp` &#124; `fp` &#124; `m` &#124; `o` &#124; `w` | <ul><li>`a`: ammunition </li><li>`b`: Bomb</li><li>`x`: Blast</li><li>`bp`: Blast Powerup</li><li>`fp`: Freeze Powerup</li><li>`m`: Metal Block</li><li>`o`: Ore Block</li><li>`w`: Wooden Block</li> |
| `owner_unit_id`  | string                                                                             | ID of the unit that owns this entity                                                                                                                                                                  |
| `expires`        | number                                                                             | Tick on which this entity will perish from the map. <br />E.g. a bomb placed with `expires=74` will explode on tick 74.                                                                               |
| `hp`             | number                                                                             | Health Points taken before entity perishes                                                                                                                                                            |
| `blast_diameter` | number                                                                             | Diameter of blast range (if this entity is a bomb)                                                                                                                                                    |

### world

(**Type**: object) Information on the world map.

```json
"world": {
    "width": 15,
    "height": 15
}
```

| Property | Type   | Description                                |
| -------- | ------ | ------------------------------------------ |
| `width`  | number | Number of cells horizontally (Default: 15) |
| `height` | number | Number of cells vertically (Default: 15)   |

### tick

(**Type**: number) The current game tick.

```
"tick": 75
```

### config

(**Type**: object) Configuration settings for the game environment. (Can be changed, see [⚙️ Environment Flags](../docs/api-reference/#%EF%B8%8F-environment-flags)).

```json
"config": {
    "tick_rate_hz": 10,
    "game_duration_ticks": 1800,
    "fire_spawn_interval_ticks": 5
},
```

| Property                    | Type   | Description                                      |
| --------------------------- | ------ | ------------------------------------------------ |
| `tick_rate_hz`              | number | Number of ticks per second                       |
| `game_duration_ticks`       | number | Number of ticks before end game fire starts      |
| `fire_spawn_interval_ticks` | number | Number of ticks between each end-game fire spawn |

### connection

(**Type**: object) Information about your agent's connection with the game server.

```json
"connection": {
    "id": 1,
    "role": "agent",
    "agent_id": "b"
}
```

| Property   | Type   | Description                                                                       |
| ---------- | ------ | --------------------------------------------------------------------------------- |
| `id`       | number | Used for managing your agent's connection to tournament servers (can be ignored). |
| `role`     | string | Either agent, spectator, or admin. See [🧩 Roles](../docs/api-reference/#roles).  |
| `agent_id` | string | Whether you are Agent A or B.                                                     |

## 📦 Game Entities

`entities` are provided in `game_state` and represent objects in the game.

Below is a list of all available entities and their required properties. For a description of the properties, see [🎮 Game State Definitions](../docs/api-reference/#-game-state-definitions).​

| Entity                       | Properties                                                                        |
| ---------------------------- | --------------------------------------------------------------------------------- |
| Metal Block (indestructible) | `created`, `x`, `y`, `type=m`                                                     |
| Wooden Block (destructible)  | `created`, `x`, `y`, `type=w`, `hp`                                               |
| Ore Block (destructible)     | `created`, `x`, `y`, `type=o`, `hp`                                               |
| Ammunition pickup            | `created`, `x`, `y`, `type=a`, `expires`, `hp`                                    |
| Blast radius powerup         | `created`, `x`, `y`, `type=bp`, `expires`, `hp`                                   |
| Freeze powerup               | `created`, `x`, `y`, `type=fp`, `expires`, `hp`                                   |
| Bomb                         | `created`, `x`, `y`, `type=b`, `owner_unit_id`, `expires`, `hp`, `blast_diameter` |
| Explosion                    | `created`, `x`, `y`, `type=x`, `owner_unit_id`, `expires`                         |
| End-game fire                | `created`, `x`, `y`, `type=x`                                                     |

## 🚩 Server Packets (Events)

On each tick, the game server will send a server packet containing updates to the game environment. These packets conform to `validServerPacket` in the validation schema.

The provided starter kits use the server packets to update and return `game_state` for you.

Below is a list of the possible event types (in the order they are executed). See [🎮 Game State Definitions](../docs/api-reference/#-game-state-definitions) for a description of each property.

### Bomb placements

```json
{
    "type": "unit",
    "agent_id": "b",
    "data": {
        "type": "bomb",
        "unit_id": "h"
    }
}
```

### Detonation

```json
{
    "type": "unit",
    "agent_id": "b",
    "data": {
        "type": "detonate",
        "coordinates": [10, 10],
        "unit_id": "h"
    }
}
```

### Movement

```json
{
    "type": "unit",
    "agent_id": "b",
    "data": {
        "type": "move",
        "move": "up",
        "unit_id": "h"
    }
}
```

### Unit state update

```json
{
    "type": "unit_state",
    "data": {
        "coordinates": [4, 10],
        "hp": 3,
        "inventory": {
            "bombs": 1
        },
        "blast_diameter": 3,
        "unit_id": "h",
        "owner_id": "b",
        "invulnerability": 0,
        "stunned": 0
    }
}
```

### Entity expired

```json
{
    "type": "entity_expired",
    "data": [4, 10]
}
```

### Entity spawned

```json
{
    "type": "entity_spawned",
    "data": {
        "created": 79,
        "x": 4,
        "y": 10,
        "type": "b",
        "unit_id": "h",
        "expires": 119,
        "hp": 1,
        "blast_diameter": 3
    }
}
```

### Entity state update

```json
{
    "type": "entity_state",
    "coordinates": [10, 9],
    "updated_entity": {
        "created": 275,
        "x": 10,
        "y": 9,
        "type": "a",
        "expires": 315,
        "hp": 0
    }
}
```

## 🕹️ Action Packets

On each tick, the game server accepts one action packet per unit per agent.

An action packet must conform to the [validation schema](https://github.com/CoderOneHQ/starter-kits/blob/6403659c68f93e053f47b3b67f0976c073ee700e/validation.schema.json#L284) (`ValidAgentPacket`). The starter kits provide an interface for sending actions.

The available action packets are detailed below.

| Action                                                                                              | Required Properties (property: type &#124; valid values)                                                                                                |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Place bomb                                                                                          | `type:` _string_ &#124; `bomb` <br> `unit_id` _string_ &#124; eg: `a`, `b`, `c`, ..                                                                     |
| Move (up, down, left, right)                                                                        | `type:` _string_ &#124; eg: `move` <br> `move:` _string_ &#124; eg: `up`, `down`, `left`, `right` <br> `unit_id:` _string_ &#124; eg: `a`, `b`, `c`, .. |
| Detonate bomb                                                                                       | `type:` _string_ &#124; eg: 'move' <br> `coordinates:` _[number, number]_ &#124; eg: [2, 4] <br> `unit_id:` _string_ &#124; eg: `a`, `b`, `c`, ..       |
| Request tick <br> (Admin-only, see [🧩Connection](../docs/api-reference/#%F0%9F%A7%A9-connection))​ | `type:` _string_ &#124; eg: `request_tick`                                                                                                              |

Example action packet:

```python
action_packet = {
    type: "bomb",
    unit_id: "c"
}
```

## 🔐 Administrator API

[Full reference found on our github](https://github.com/CoderOneHQ/bomberland/blob/2faea184e179949a4d01e49359ddaa521b6d9bd9/validation.schema.json#L10)

Requirements:

1. You must have `ADMIN_ROLE_ENABLED=1` flag set to use this feature.
1. You must be connected as the `admin` role to send these packets.

### Reset game

Allows you to restart or renew the game instead of having to restart the game engine. You can also provide an optional `prng_seed` and `world_seed` property to reset the game with. (Also available in the administrator UI).

```typescript
export interface RequestGameReset {
    readonly type: "request_game_reset";
    readonly world_seed?: number;
    readonly prng_seed?: number;
}
```

### Tick through the game manually

You need to have `TRAINING_MODE_ENABLED=1` configured for the engine to use this.

Allows you to step through a game tick by tick to get a better grasp of what is happening. (Also available in the administrator UI).

```json
{
    "type": "request_tick"
}
```

### Get next game state

You need to have `TRAINING_MODE_ENABLED=1` configured for the engine to use this.

This allows you to get the next state of the game given a `game_state` and a list of actions as defined by the typescript schema below:

```typescript
export interface EvaluateNextStatePacket {
    readonly type: "next_game_state";
    readonly sequence_id: number;
    readonly state: GameState;
    readonly actions: Array<{
        readonly agent_id: string;
        readonly action: AgentPacket;
    }>;
}
```

The response will be the next game state as evaluated by the game engine.

## ⚙️ Environment Flags

The environment's default variables can be changed by setting the appropriate flag in `docker-compose.yml`.

You will need to add the `--build` flag when restarting the game engine (i.e. `docker-compose --build`).

| Environment Variable                                   | Description                                                                                                                                                                        |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ADMIN_ROLE_ENABLED=1`                                 | Enables / disables admin role (will be disabled in tournament mode)                                                                                                                |
| `AGENT_SECRET_ID_MAP=agentA,agentB`                    | Used for game connection                                                                                                                                                           |
| `AMMO_DURATION_TICKS=40`                               | Number of ticks before ammunition pickup perishes                                                                                                                                  |
| `AMMO_SPAWN_WEIGHTING=0`                               | If a spawn appears, weighting % that it will be an ammunition (versus a powerup). <br> `AMMO_SPAWN_WEIGHTING + BLAST_POWERUP_SPAWN_WEIGHTING + FREEZE_POWERUP_SPAWN_WEIGHTING = 1` |
| `BLAST_DURATION_TICKS=5`                              | Number of ticks before blast disappears                                                                                                                                            |
| `BLAST_POWERUP_DURATION_TICKS=40`                      | Number of ticks before blast powerup perishes                                                                                                                                      |
| `BLAST_POWERUP_SPAWN_WEIGHTING=0.5`                    | If a spawn appears, weighting % that it will be a blast powerup. <br> `AMMO_SPAWN_WEIGHTING + BLAST_POWERUP_SPAWN_WEIGHTING + FREEZE_POWERUP_SPAWN_WEIGHTING = 1`                  |
| `BOMB_DURATION_TICKS=40`                               | Number of ticks before a bomb explodes                                                                                                                                             |
| `BOMB_ARMED_TICKS=5`                                   | Number of ticks before a bomb can be remotely detonated                                                                                                                            |
| `ENTITY_SPAWN_PROBABILITY_PER_TICK=0`                  | Probability of a spawn appearing somewhere on the map each tick                                                                                                                    |
| `FIRE_SPAWN_INTERVAL_TICKS=2`                          | Number of ticks between each single tile of fire spawned                                                                                                                           |
| `FREEZE_DEBUFF_DURATION_TICKS=15`                      | Number of ticks that a unit will be stunned for by a freeze powerup                                                                                                                |
| `FREEZE_POWERUP_DURATION_TICKS=40`                     | Number of ticks before a freeze powerup perishes                                                                                                                                   |
| `FREEZE_POWERUP_SPAWN_WEIGHTING=0.5`                   | If a spawn appears, weighting % that it will be a freeze powerup. <br> `AMMO_SPAWN_WEIGHTING + BLAST_POWERUP_SPAWN_WEIGHTING + FREEZE_POWERUP_SPAWN_WEIGHTING = 1`                 |
| `GAME_DURATION_TICKS=200`                              | Number of ticks before ring of fire spawns                                                                                                                                         |
| `GAME_START_DELAY_MS=2000`                             | Time (ms) before game server starts after both agents connect                                                                                                                      |
| `INITIAL_AMMUNITION=9999`                              | Starting number of ammunition per unit                                                                                                                                             |
| `INITIAL_BLAST_DIAMETER=3`                             | Starting blast diameter for bombs (number of tiles including the bomb's tile)                                                                                                      |
| `INITIAL_HP=3`                                         | Initial unit health points                                                                                                                                                         |
| `INVULNERABILITY_TICKS=5`                              | Number of ticks an agent is invulnerable for                                                                                                                                       |
| `SYMMETRICAL_MAP_ENABLED=1`                            | Disable/enable whether the generated map will be symmetrical across the Y (vertical)-axis                                                                                          |
| `TELEMETRY_ENABLED=1`                                  | Disable/enable game server log outputs                                                                                                                                             |
| `TRAINING_MODE_ENABLED=1`                              | Enables admin role (see [🧩 Roles](../docs/api-reference/#roles)). Agent actions are no longer tied to the clock and ticks need to be stepped through manually.                    |
| `MAP_HEIGHT=15`                                        | Size of map (y-axis)                                                                                                                                                               |
| `MAP_WIDTH=15`                                         | Size of map (x-axis)                                                                                                                                                               |
| `MAXIMUM_CONCURRENT_BOMBS=3`                           | Maximum number of bombs than a unit may have on the map at any one time                                                                                                            |
| `OBJECT_DESTRUCTION_ITEM_DROP_PROBABILITY=0.5`           | Controls how often an item will drop when a wooden block or an ore block is destroyed                                                                                              |
| `ORE_BLOCK_FREQUENCY=0.3617283950617284`               | Controls the number of ore blocks in the world                                                                                                                                     |
| `PORT=3000`                                            | For game server communication                                                                                                                                                      |
| `PRNG_SEED`                                            | Defaults to a random seed if no flag is specified. See [🗺️ Map generation​](../docs/api-reference/#%EF%B8%8F-map-generation-using-prng_seed-and-world_seed)                        |
| `SAVE_REPLAY_ENABLED=1`                                | Enable/disable the the option to save replay files from the client                                                                                                                 |
| `SHUTDOWN_ON_GAME_END_ENABLED=1`                       | Disable/enable shutdown of game server once game is over.                                                                                                                          |
| `STEEL_BLOCK_FREQUENCY=0.1222222222222222`             | Controls number of steel blocks in map                                                                                                                                             |
| `TICK_RATE_HZ=10`                                      | Number of ticks per second                                                                                                                                                         |
| `TOTAL_AGENTS=2`                                       | Number of agents allowed in the game                                                                                                                                               |
| `TOURNAMENT_AGENT_CONNECTION_GRACE_PERIOD_MS=OPTIONAL` | Time that the game server will wait for agents to connect before disqualifying them (used for official tournament matches)                                                         |
| `UI_ENABLED=1`                                         | Enable/disable the game client/UI                                                                                                                                                  |
| `UNITS_PER_AGENT=3`                                    | Number of units an agent controls                                                                                                                                                  |
| `WOOD_BLOCK_FREQUENCY=0.1969135802469136`              | Controls number of wooden blocks in map                                                                                                                                            |
| `WORLD_SEED`                                           | Defaults to a random seed if no flag is specified. See [🗺️ Map generation​](../docs/api-reference/#%EF%B8%8F-map-generation-using-prng_seed-and-world_seed)​                       |

## 🗺️ Map generation (using PRNG_SEED and WORLD_SEED)

Maps are symmetrically and pseudo-randomly generated.

By default, the same map will be generated each time the game is loaded. You can change this by changing the environment variables:

-   **Game Seed** `PRNG_SEED`: stochasticity of the game and item spawns

-   **World Seed** `WORLD_SEED`: generation of the first game map (placement of blocks etc)

Both can be set to an integer value between `0` and `9,007,199,254,740,991`.

Remember to vary the game/world seeds so that your agent doesn't overfit to the default map.

Some seeds will generate invalid maps.

## 🔼 Forward Model

**The forward model will not be provided in tournament servers. You can still use the forward model for your own training purposes, but this feature is still experimental**. This feature is intended for agents to build simulations of potential future states (such as for Monte Carlo Tree Search).

If you're interested in this feature, please get in touch with us on [Discord](https://discord.gg/NkfgvRN) or [email](mailto:humans@gocoder.one) so we can improve on it!

We've provided starter kits for implementing an agent that uses a forward model (\_fwd) to simulate actions in the game state.

At a high level:

1. The forward model agent is provided two connections (one to the game, and one to the forward model server)

1. The forward model can use the `ForwardState` class to invoke next(...) with a sequence ID (used as a way to acknowledge the packet by the server)

1. When a response is received the callback `_on_next_game_state` is invoked and the object passed into it contains the same sequence ID so the agent can map it to whatever data store / object and use that to make decisions.

1. An example of all the packets is included in the JSON-schema definition for users who want to implement a game agent in a language of their choice.
