---
slug: "/docs/getting-started"
title: "Getting started"
description: "Quickly get started with the Bomberland environment"
order: 1
---

## Step 1: Clone the Bomberland starter kit repo

- **Option 1:** Clone the repo: `git clone git@github.com:CoderOneHQ/bomberland.git`
- **Option 2:** [Download the repo →](https://github.com/CoderOneHQ/bomberland)

(You'll also need the `base-compose.yml` and `docker-compose.yml` files in the root folder)

## Step 2: Install Docker

Docker is used to start the game engine and connect both agents in a single command. It's also used to ensure the same performance of your agent locally versus on our servers.

[Download Docker →](https://www.docker.com)

> The Docker flow is used for the rest of this guide. You can also access the engine binary below:
> 
> [Download Binary →](https://github.com/CoderOneHQ/bomberland/releases/tag/build-974)

## Step 3: Start the game server

Make sure Docker is running. 

From the root directory of your starter kit, run in your terminal:

```bash
docker-compose up --abort-on-container-exit --force-recreate
```

It may take a few minutes to run the first time. This will build the game server, and connect your starter agent.

Once the game server is running, you should see:
```bash
game-server_1    | [1] 2021-10-28T02:57:47.701Z - Agent [defaultName](b) connected to the server
```

Since Bomberland is a 2-player environment, the game engine will wait for a second agent to connect.

## Step 4: Join the game as a human player

1. In either a Firefox or Chrome browser, open the [Game client →](/game)
2. Leave the default settings. Click **Connect**.
3. Use the following keys to play as the Wizard:

-   **Click** a unit to control it
-   `↑` / `↓` / `←` / `→` - arrows to move
-   `SPACE` - place a bomb
-   Click a bomb to detonate it

## Step 5: Submit your first agent

You can submit an agent to compete against others in 1v1 matches. Matches run weekly and top agents are displayed on the [leaderboard](/leaderboard). 

To submit:
1. Create a [Team](/team) (teams can be 1 - 5 members).
2. Navigate to [Submissions](/submissions) and paste the following: `docker.io/coderonehq/hello-world`. This image contains a basic starter agent that takes random actions.
3. Click **Submit Agent**. 
4. After a few minutes, you should see the message "Successfully pulled image".

You've now submitted your first agent to the competition! Check back regularly to see your results from the [Matches](/adjudicated-games) page.

## Next steps
You're now all set up to compete in Bomberland.

If you need help, please reach out on [Discord](https://discord.gg/NkfgvRN).

Here are some tasks to try:

- [ ] **Switch agents:** `docker-compose.yml` specifies which agents to connect. Try switching which character you play as, or playing your agent against itself.
- [ ] **Change environment variables:** Settings such as tick rate, map size, no. of agents can be changed under `docker-compose.yml` > `game-server` > `environment`. See [⚙️ Environment Flags](/docs/api-reference/#%EF%B8%8F-environment-flags) for a full list of available settings.
- [ ] **Improve the starter agent:** Try building an agent that beats the random agent.
- [ ] **Make a new submission:** Follow the [Submission Instructions](/docs/submission-instructions).

> **Tip:** Add a `--build` flag in your `docker-compose up` command whenever you make a change to the `docker-compose.yml` or `base-compose.yml` files. i.e.:
> 
> ```bash
> docker-compose up --abort-on-container-exit --force-recreate --build
> ```