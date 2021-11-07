# Based on https://www.jmoisio.eu/en/blog/2020/06/01/building-cpp-containers-using-docker-and-cmake/
#
# The new base image to contain runtime dependencies

FROM debian:buster-slim AS base

RUN set -ex;                       \
    apt-get update;                \
    apt-get -y upgrade

# The first stage will install build dependencies on top of the
# runtime dependencies, and then compile

FROM base AS builder

RUN set -ex;                        \
    apt-get install -y g++ make;    \
    mkdir -p /app;                                                                  

COPY . /app

RUN set -ex;                        \
    cd /app;                        \
    make distclean; make

# The second stage will already contain all dependencies, just copy
# the compiled executables

FROM base AS runtime

COPY --from=builder /app/agent /usr/local/bin

ENTRYPOINT sleep 1; /usr/local/bin/agent