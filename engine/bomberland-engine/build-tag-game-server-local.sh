#!/bin/bash
pushd ../
docker build -f ./game-server/Dockerfile . --target build -t gs-build-local --build-arg ENVIRONMENT=dev --build-arg BUILD=0
CID=$(docker create gs-build)
docker cp ${CID}:/app/game-server/Program.exe Program.exe
docker cp ${CID}:/app/game-server/Program Program
docker rm ${CID}
docker build -f ./game-server/Dockerfile . --build-arg ENVIRONMENT=dev -t gs-local --build-arg BUILD=0
rm Program.exe Program
