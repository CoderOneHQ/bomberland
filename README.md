[![Engine Version](https://img.shields.io/badge/engine%20ver.-2344-blue)](#release-notes)

# Bomberland engine + starter kits

## About

[Bomberland](https://www.gocoder.one/bomberland) is a multi-agent AI competition inspired by the classic console game Bomberman.

Teams build intelligent agents using strategies from tree search to deep reinforcement learning. The goal is to compete in a 2D grid world collecting power-ups and placing explosives to take your opponent down.

This repo contains starter kits for working with the game engine + the engine source!

![Bomberland multi-agent environment](./engine/bomberland-ui/src/source-filesystem/docs/2-environment-overview/bomberland-preview.gif "Bomberland")

## Contributing

Contributions are always welcome, see our contribution guidelines [here](CONTRIBUTING.md)

## Usage

### Basic usage

See: [Documentation](https://www.gocoder.one/docs)

1. Clone or download this repo (including both `base-compose.yml` and `docker-compose.yml` files).
1. To connect agents and run a game instance, run from the root directory:

```
docker-compose up --abort-on-container-exit --force-recreate
```

### Open AI gym wrapper

`docker-compose -f open-ai-gym-wrapper-compose.yml up --force-recreate --abort-on-container-exit`

## Starter kits

| Kit                 | Link                                                                           | Description                                        | Up-to-date? | Contributed by                          |
| ------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- | ----------- | --------------------------------------- |
| Python3             | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/python3)    | Basic Python3 starter                              | ✅          | Coder One                               |
| Python3-fwd         | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/python3)    | Includes example for using forward model simulator | ❌          | Coder One                               |
| Python3-gym-wrapper | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/python3)    | Open AI Gym wrapper                                | ❌          | Coder One                               |
| TypeScript          | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/typescript) | Basic TypeScript starter                           | ✅          | Coder One                               |
| TypeScript-fwd      | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/typescript) | Includes example for using forward model simulator | ❌          | Coder One                               |
| Go                  | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/go)         | Basic Go starter                                   | ❌          | [dtitov](https://github.com/dtitov)     |
| C++                 | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/cpp)        | Basic C++ starter                                  | ❌          | [jfbogusz](https://github.com/jfbogusz) |
| Rust                | [Link](https://github.com/CoderOneHQ/bomberland/tree/master/agents/rust)       | Basic Rust starter                                 | ❌          | [K-JBoon](https://github.com/K-JBoon)   |

## Discussion and Questions

Join our community on [Discord](https://discord.gg/Hd8TRFKsDa).

Please let us know of any bugs or suggestions by [raising an Issue](https://github.com/CoderOneHQ/starter-kits/issues).

## Changelog

See changelog [here](CHANGELOG.md)
