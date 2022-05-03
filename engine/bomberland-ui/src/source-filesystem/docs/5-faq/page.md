---
slug: "/docs/faq"
title: "Troubleshooting and FAQ"
description: "Answers to common questions and issues"
order: 5
---

If you can't find a resolution to your issue below, please report it on our [GitHub Repo](https://github.com/CoderOneHQ/bomberland/issues) or [Discord](https://discord.gg/NkfgvRN).

## General

### How do I change what agents are playing?
By default, the [provided starter kits](https://github.com/CoderOneHQ/bomberland#starter-kits) will only connect Agent B (knight). You can play as Agent A (wizard) via the [client](https://www.gocoder.one/game).

**To connect a second agent:**
1. Open `docker-compose.yaml`
1. Uncomment the `agent-a` block
1. Re-build containers by adding a `--build` flag (i.e. `docker-compose up --abort-on-container-exit --force-recreate --build`)

**To switch agents** (e.g. switching from Python to another starter kit):
1. Open `docker-compose.yaml`
1. Change the `service` value under `agent-a` or `agent-b` for any of the services in `base-compose.yaml`
1. Re-build containers: `docker-compose up --abort-on-container-exit --force-recreate --build`

### How do I run one step at a time?
Check out the 'Tick through the game manually' administrator feature [here](/docs/api-reference/#-administrator-api).

### How do I restart the game without restarting the Docker containers?
Check out the 'Reset Game' administrator feature [here](/docs/api-reference/#-administrator-api).

### Can I change the tick rate, starting variables etc?
Yes, you can change environment variables using the flags [here](/docs/api-reference/#%EF%B8%8F-environment-flags).

### What resources will be available for my agent during online matches?
It will be safe to assume the following default runtime resources will be available:

```yaml
--cpus=2
--cpu-period=100000
--memory=1024m
```

### What happens if my Agent makes an invalid move?
If your Agent tries to make an invalid move, the server will drop the action and your Agent will do nothing instead.
If both Agents try and occupy the same spot in the same tick, both agents will have their actions dropped.

### In what order does the game server resolve events?
The game server will resolve events in the order listed [here](/docs/api-reference/#-server-packets-events).

## Troubleshooting

### I've switched the agents in `docker-compose.yaml` but the game engine is still using the old agents.
Try re-building containers each time you make a change to `docker-compose.yaml` or `base-compose.yaml`:

```bash
docker-compose up --abort-on-container-exit --force-recreate --build
```

### I get the error 'Failed to connect to the game engine.' when I use the game client.

1. Check the game engine is running locally. For instructions, see [Getting Started](/docs/getting-started).
2. Use Chrome or Firefox. There is a known issue with Safari.

### What do the `-dev` labels in docker-compose files refer to?
Servers labelled `dev` mount your host volume to the container. When changes are made to your agent, they will be reflected once you restart the agent container, without needing to rebuild the image. Servers **without** the dev label are best for testing your submission build.

### ERROR: docker.errors.DockerException: Error while fetching server API version: {'Connection Aborted.', ConnectionRefusedError(61, 'Connection refused'))
The Docker CLI is unable to reach the Docker Daemon. Check that your Docker is up and running.

### ERROR: The Compose file './docker-compose.yml' is invalid because: Unsupported config option for services.agent-b: 'extends'
This might be because you are using an older version of docker-compose which does not support the keyword `extends`. You will need to update docker-compose to version 1.27+.

### ERROR: throw new Error("No agents were instantiated probably due to invalid world configuration")
The set `WORLD_SEED` is invalid (i.e. game is trying to generate a map that breaks some pre-defined rules). Try using another WORLD_SEED.
