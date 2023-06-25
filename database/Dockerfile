FROM python:3.11.4 AS sqlite
COPY database/compile.py database/schema.sql ./posts ./
RUN python3 -m pip install -qqq\
        markdown\
        htmlmin\
        pygments\
        markdown-katex\
        markdown-full-yaml-metadata\
        pymdown-extensions\
        mdx-breakless-lists\
        pygments\
        markdown-captions
RUN bash -c "python3 compile.py *.md"  # creates db.sqlite3 and feed.rss

# this could be extracted to a separate image
FROM rust:1.67.0-alpine3.17 AS build
RUN apk add --no-cache musl-dev
RUN rustup target add x86_64-unknown-linux-musl
WORKDIR /usr/src
COPY database/Cargo.lock database/Cargo.toml ./
COPY database/src/ ./src
RUN cargo build --release

FROM scratch
COPY --from=build /usr/src/target/release/database ./
ENV ROCKET_PORT=80
ENV ROCKET_ADDRESS=0.0.0.0
EXPOSE 80
COPY --from=sqlite /db.sqlite3 /feed.rss ./
CMD [ "./database" ]