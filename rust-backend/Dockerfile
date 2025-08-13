# --- Build stage ---
FROM rust:1.85 AS build

WORKDIR /app

COPY backend/ ./

RUN cargo build --release

# --- Runtime stage ---
FROM gcr.io/distroless/cc-debian12

COPY --from=build /app/target/release/quark /app/server

EXPOSE 8080

CMD ["/app/server"]