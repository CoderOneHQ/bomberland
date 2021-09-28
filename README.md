[![Engine Version](https://img.shields.io/badge/engine%20ver.-974-blue)](#release-notes)

# About

[Bomberland](ttps://www.gocoder.one/bomberland?s=gh) is a 1v1 multi-agent environment inspired by the classic console game Bomberman.

Teams build intelligent agents using strategies from tree search to deep reinforcement learning. The goal is to compete in a 2D grid world collecting power-ups and placing explosives to take your opponent down.


This repo contains starter kits for working with the game API.

![Multi-agent game](https://uploads-ssl.webflow.com/5ed1e873ef82ae197179be22/6147ebda75e04416d37dad06_bomberland.gif)

# Usage

See: [Documentation](https://www.gocoder.one/docs?s=gh)

1. Clone or download this repo (including both `base-compose.yml` and `docker-compose.yml` files).
1. To connect agents and run a game instance, run from the root directory:

```
docker-compose up --abort-on-container-exit --force-recreate
```

# Starter kits
| Kit | Link | Description | Up-to-date? | Contributed by |
| --- | --- | --- | --- | --- |
| Python3 | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3) | Basic Python3 starter | ✅ | Coder One |
| Python3-fwd | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/python3) | Includes example for using forward model simulator | ❌ | Coder One |
| TypeScript | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/typescript) | Basic TypeScript starter | ❌ | Coder One |
| TypeScript-fwd | [Link](https://github.com/CoderOneHQ/starter-kits/tree/master/typescript) | Includes example for using forward model simulator | ❌ | Coder One |
Go | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/go) | Basic Go starter | ✅ | [dtitov](https://github.com/dtitov)

# Contributing
Contributions for Bomberland starter kits in other languages (as well improvements to existing starter kits) are welcome!

Starter kits in new languages should implement the simulation logic for handling game state updates (see [example](https://github.com/CoderOneHQ/starter-kits/blob/master/python3/game_state.py)) and follow the [validation schema](https://github.com/CoderOneHQ/starter-kits/blob/master/validation.schema.json).

For any help, please contact us directly on [Discord](https://discord.gg/NkfgvRN) or via [email](mailto:humans@gocoder.one).

# Release Notes
| Ver. | Changes | Binary |
| --- | --- | --- |
| 974 | Added functionality: <ul><li>Reset the game without restarting engine/containers</li><li>Evaluate next state by the game engine given a state + list of actions</li></ul> See: [Docs](https://gocoder.one/docs/api-reference#-administrator-api?s=gh) | [Link](https://github.com/CoderOneHQ/bomberland/releases/tag/build-974)

# Discussion and Questions

Join our community on [Discord](https://discord.gg/NkfgvRN).

Please let us know of any bugs or suggestions by [raising an Issue](https://github.com/CoderOneHQ/starter-kits/issues).