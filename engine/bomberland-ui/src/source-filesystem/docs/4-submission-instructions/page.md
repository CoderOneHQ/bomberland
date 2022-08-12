---
slug: "/docs/submission-instructions"
title: "Submission Instructions"
description: "Quickly get started with the Bomberland environment"
order: 4
---

To join a tournament, you will need to push your Docker image to a public registry and upload it to the [Submissions page](https://www.gocoder.one/submissions).

You can use any public registry. Follow instructions below for Docker Hub:

## Step 1: Check your connection and production build

Make sure your agent has a GAME_CONNECTION_STRING as an environment variable (and not as a hard-coded string).

```bash
const gameConnectionString = process.env["GAME_CONNECTION_STRING"]
uri = os.environ.get(
    'GAME_CONNECTION_STRING')
```

You can check that your agent is production-ready by switching your agent services in `docker-compose.yml` for services provided in `base-compose.yml` that do not have the `-dev` label. These services do not mount your host volume to the container and are therefore more representative of a production-ready build.

If it builds correctly with `docker-compose up` it should be OK to submit.

## Step 2: Set up Docker Hub

If you haven't already, create a free Docker Hub account [here](https://hub.docker.com/).
Login from your terminal using the command `docker login`.

## Step 3: Push the image to Docker Hub

Navigate to the working directory containing your agent's Dockerfile. Then run in your terminal:

```bash
docker build . -t my-dockerhub-username/my-repo-name
docker push my-dockerhub-username/my-repo-name
```

You will see output similar to:

```bash
> docker push my-dockerhub-username/my-repo-name
Using default tag: latest
#### ↓ ~~~~~~ SUBMIT THIS ~~~~~~ ↓ ####
The push refers to repository [docker.io/my-dockerhub-username/my-repo-name]
b972422d72dd: Pushed
c1ee23f20937: Pushed
...
```

Upload the public registry link to the [Submissions →](https://www.gocoder.one/submissions) page. If you have submitted correctly, you will see the message "Successfully pulled image".
