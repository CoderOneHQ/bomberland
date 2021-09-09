[![Game Version](https://img.shields.io/badge/game%20ver.-894-blue)](https://www.gocoder.one/docs/release-notes) [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-green)](https://github.com/CoderOneHQ/starter-kits/pulls)

# About

Bomberland is a 2D gridworld multi-agent environment inspired by the classic game [Bomberman](https://en.wikipedia.org/wiki/Bomberman). It is designed for an upcoming AI competition called [Coder One](https://www.gocoder.one). 

Each agent controls multiple units. The goal is to take down all of your opponent's units before they take down yours.
This repo contains starter kits for working with the game API.

![Multi-agent game](https://uploads-ssl.webflow.com/5ed1e873ef82ae197179be22/60b32c120df5e9f4e02512ee_game-preview.gif)

# Usage

See: [Documentation](https://www.gocoder.one/docs)

All starter kits provide an example for connecting with the game server via websockets, and how to send actions to the game server.

Start by cloning or downloading this repo (including both `base-compose.yml` and `docker-compose.yml` files).

To connect agents and run a game instance, run from the root directory:

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
We'd love any contributions to the starter kits. Feel free to raise a PR for review.

Starter kits in other languages should implement the simulation logic for handling game state updates (see [example](https://github.com/CoderOneHQ/starter-kits/blob/master/python3/game_state.py)) and follow the [validation schema](https://github.com/CoderOneHQ/starter-kits/blob/master/validation.schema.json).

# Discussion and Questions

Join the community on [Discord](https://discord.gg/NkfgvRN).

Please let us know of any bugs or suggestions by [raising an Issue](https://github.com/CoderOneHQ/starter-kits/issues).
