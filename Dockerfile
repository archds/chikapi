FROM node:19 as webapp_builder

WORKDIR /app

COPY ./app/package*.json ./

RUN npm ci

COPY ./app ./

RUN npm run build

FROM rust:1.66 as backend_builder

RUN rustup override set nightly

WORKDIR /app

COPY Cargo.toml Cargo.lock Rocket.toml ./
COPY ./src ./src
COPY --from=webapp_builder ./app/dist ./app/dist

RUN cargo install --path .
