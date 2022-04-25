FROM node:16.13.2-alpine as build
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

COPY bomberland-library/package.json /app/bomberland-library/package.json
COPY bomberland-library/tsconfig.json /app/bomberland-library/tsconfig.json


COPY bomberland-engine/package.json /app/bomberland-engine/package.json

COPY bomberland-ui/package.json /app/bomberland-ui/package.json
COPY bomberland-ui/tsconfig.json /app/bomberland-ui/tsconfig.json

WORKDIR /app
RUN yarn install
COPY . /app

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}
ARG BUILD
ENV BUILD=${BUILD}

RUN yarn build:all

# copy artifacts
FROM ubuntu:20.10
COPY --from=build /app/bomberland-engine/linux /app/bomberland-engine
WORKDIR /app
RUN chmod +x ./bomberland-engine
ENTRYPOINT ["/app/bomberland-engine"]
