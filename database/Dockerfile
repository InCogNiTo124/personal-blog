FROM rust:1.72.1-alpine3.17 AS build
RUN apk add --no-cache musl-dev
RUN rustup target add x86_64-unknown-linux-musl
WORKDIR /usr/src
COPY Cargo.lock Cargo.toml ./
COPY src/ ./src
RUN cargo build --release

FROM scratch
COPY --from=build /usr/src/target/release/database ./
ENV ROCKET_PORT=80
ENV ROCKET_ADDRESS=0.0.0.0
EXPOSE 80
CMD [ "./database" ]