[![Engine Version](https://img.shields.io/badge/engine%20ver.-1555-blue)](#release-notes)

# About

[Bomberland](https://www.gocoder.one/bomberland) is a multi-agent AI competition inspired by the classic console game Bomberman.

Teams build intelligent agents using strategies from tree search to deep reinforcement learning. The goal is to compete in a 2D grid world collecting power-ups and placing explosives to take your opponent down.

This repo contains starter kits for working with the game API.

![Bomberland multi-agent environment](https://www.gocoder.one/static/bomberland-529e18e676d8d28feca69f8f78a35c55.gif "Bomberland")

# Usage

## Basic usage

See: [Documentation](https://www.gocoder.one/docs)

1. Clone or download this repo (including both `base-compose.yml` and `docker-compose.yml` files).
1. To connect agents and run a game instance, run from the root directory:

```
docker-compose up --abort-on-container-exit --force-recreate
```

## Open AI gym wrapper

`docker-compose -f open-ai-gym-wrapper-compose.yml up --force-recreate --abort-on-container-exit`

# Starter kits

| Kit                 | Link                                                                      | Description                                        | Up-to-date? | Contributed by                          |
| ------------------- | ------------------------------------------------------------------------- | -------------------------------------------------- | ----------- | --------------------------------------- |
| Python3             | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3)    | Basic Python3 starter                              | ✅          | Coder One                               |
| Python3-fwd         | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3)    | Includes example for using forward model simulator | ✅          | Coder One                               |
| Python3-gym-wrapper | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3)    | Open AI Gym wrapper                                | ✅          | Coder One                               |
| TypeScript          | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/typescript) | Basic TypeScript starter                           | ❌          | Coder One                               |
| TypeScript-fwd      | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/typescript) | Includes example for using forward model simulator | ❌          | Coder One                               |
| Go                  | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/go)           | Basic Go starter                                   | ✅          | [dtitov](https://github.com/dtitov)     |
| C++                 | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/C%2B%2B)      | Basic C++ starter                                  | ✅          | [jfbogusz](https://github.com/jfbogusz) |

# Contributing

Contributions for Bomberland starter kits in other languages (as well improvements to existing starter kits) are welcome!

Starter kits in new languages should implement the simulation logic for handling game state updates (see [example](https://github.com/CoderOneHQ/starter-kits/blob/master/python3/game_state.py)) and follow the [validation schema](https://github.com/CoderOneHQ/starter-kits/blob/master/validation.schema.json).

For any help, please contact us directly on [Discord](https://discord.gg/NkfgvRN) or via [email](mailto:humans@gocoder.one).

# Release Notes

| Ver. | Changes                                                                                                                                                                                                                                          | Date          | Binary                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------------------------ |
| 1555 | Changes to support open ai gym wrapper                                                                                                                                                                                                           | 6th Dev 2021  | [Link](https://github.com/CoderOneHQ/bomberland/releases/tag/build-1555) |
| 1523 | Forward model bug fixes + unit move blocking on moving to same cell + reset game with a set world and prng seed (See: [Docs](https://www.gocoder.one/docs/api-reference#reset-game))                                                             | 29th Nov 2021 | [Link](https://github.com/CoderOneHQ/bomberland/releases/tag/build-1523) |
| 1065 | Added `UNITS_PER_AGENT` environment flag (See: [Docs](https://gocoder.one/docs/api-reference#%EF%B8%8F-environment-flags))                                                                                                                       | 9th Oct 2021  | -                                                                        |
| 974  | Added functionality: <ul><li>Reset the game without restarting engine/containers</li><li>Evaluate next state by the game engine given a state + list of actions</li></ul> See: [Docs](https://gocoder.one/docs/api-reference#-administrator-api) | 18th Sep 2021 | [Link](https://github.com/CoderOneHQ/bomberland/releases/tag/build-974)  |

# Discussion and Questions

Join our community on [Discord](https://discord.gg/NkfgvRN).

Please let us know of any bugs or suggestions by [raising an Issue](https://github.com/CoderOneHQ/starter-kits/issues).
