[![Engine Version](https://img.shields.io/badge/engine%20ver.-974-blue)](#release-notes)

# About

Bomberland is a 1v1 multi-agent environment inspired by the classic console game [Bomberman](https://en.wikipedia.org/wiki/Bomberman) organised by [Coder One](https://www.gocoder.one). For more information, check out the [Bomberland homepage](https://www.gocoder.one/bomberland).

Teams build intelligent agents using strategies from tree search to deep reinforcement learning. The goal is to compete in a 2D grid world collecting power-ups and placing explosives to take your opponent down.

This repo contains starter kits for working with the game API.

![Multi-agent game](https://www.gocoder.one/static/bomberland-ed5869293b68899949b910448dbab972.gif)

# Usage

See: [Documentation](https://www.gocoder.one/docs)

1. Clone or download this repo (including both `base-compose.yml` and `docker-compose.yml` files).
1. To connect agents and run a game instance, run from the root directory:

```
docker-compose up --abort-on-container-exit --force-recreate
```

# Starter kits
| Kit | Link | Description | Up-to-date?
| --- | --- | --- | --- |
| Python3 | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3) | Basic Python3 starter | ✅ |
| Python3-fwd | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3) | Includes example for using forward model simulator | ❌ |
| TypeScript | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/typescript) | Basic TypeScript starter | ❌ |
| TypeScript-fwd | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/typescript) | Includes example for using forward model simulator | ❌ |

# Contributing
Contributions for Bomberland starter kits in other languages (as well improvements to existing starter kits) are welcome!

Starter kits in new languages should implement the simulation logic for handling game state updates (see [example](https://github.com/CoderOneHQ/starter-kits/blob/master/python3/game_state.py)) and follow the [validation schema](https://github.com/CoderOneHQ/starter-kits/blob/master/validation.schema.json).

For any help, please contact us directly on [Discord](https://discord.gg/NkfgvRN) or via [email](mailto:humans@gocoder.one).

# Release Notes
| Ver. | Changes |
| --- | --- |
| 974 | Added functionality: <ul><li>Reset the game without restarting engine/containers</li><li>Evaluate next state by the game engine given a state + list of actions</li></ul> See: [Docs](https://gocoder.one/docs/api-reference#-administrator-api?s=gh) |

# Discussion and Questions

Come join our community on [Discord](https://discord.gg/NkfgvRN).

Please let us know of any bugs or suggestions by [raising an Issue](https://github.com/CoderOneHQ/starter-kits/issues).
