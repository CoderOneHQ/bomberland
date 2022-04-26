FROM node:14.18.1-alpine3.11 as build-ui

RUN apk update
RUN \
    apk add --no-cache gcc python3 make g++ automake autoconf libtool nasm shadow musl-dev tiff jpeg zlib zlib-dev file pkgconf && \
    apk add vips-dev fftw-dev --no-cache --repository http://dl-3.alpinelinux.org/alpine/v3.10/community --repository http://dl-3.alpinelinux.org/alpine/v3.10/main vips-dev && \
    rm -fR /var/cache/apk/*

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

COPY bomberland-library/package.json /app/bomberland-library/package.json
COPY bomberland-library/tsconfig.json /app/bomberland-library/tsconfig.json

COPY bomberland-ui/package.json /app/bomberland-ui/package.json

WORKDIR /app
RUN yarn install

COPY bomberland-library /app/bomberland-library

WORKDIR /app/bomberland-library
RUN yarn build
WORKDIR /app/bomberland-ui
RUN yarn install
COPY bomberland-ui /app/bomberland-ui
ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}
ARG GATSBY_BUILD
ENV GATSBY_BUILD=${GATSBY_BUILD}
RUN yarn run build

FROM node:16.13.2-alpine as build-engine
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

COPY bomberland-library/package.json /app/bomberland-library/package.json
COPY bomberland-library/tsconfig.json /app/bomberland-library/tsconfig.json


COPY bomberland-engine/package.json /app/bomberland-engine/package.json
COPY bomberland-engine/tsconfig.json /app/bomberland-engine/tsconfig.json

WORKDIR /app
RUN yarn install

COPY bomberland-library /app/bomberland-library

WORKDIR /app/bomberland-library
RUN yarn build
WORKDIR /app/bomberland-engine
RUN yarn install
COPY bomberland-engine /app/bomberland-engine
RUN yarn run test

ARG ENVIRONMENT
ENV ENVIRONMENT=${ENVIRONMENT}
ARG BUILD
ENV BUILD=${BUILD}

COPY --from=build-ui /app/bomberland-ui/public /app/bomberland-engine/public

RUN yarn run build
RUN yarn run build:windows
RUN yarn run build:linux
RUN yarn run build:osx

# copy artifacts
FROM ubuntu:20.10
COPY --from=build-engine /app/bomberland-engine/linux /app/bomberland-engine
WORKDIR /app
RUN chmod +x ./bomberland-engine
ENTRYPOINT ["/app/bomberland-engine"]