FROM rust:1-slim-bookworm AS build
RUN USER=root cargo new --bin bomberland_starter_kit
WORKDIR /bomberland_starter_kit

COPY ./Cargo.lock ./Cargo.lock
COPY ./Cargo.toml ./Cargo.toml

RUN cargo build --release
RUN rm src/*.rs
COPY ./src ./src

RUN rm ./target/release/deps/bomberland_starter_kit*
RUN cargo build --release

FROM debian:bookworm-slim
COPY --from=build /bomberland_starter_kit/target/release/bomberland_starter_kit .
CMD ["./bomberland_starter_kit"]
