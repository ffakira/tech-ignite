# base stage with Bun
FROM oven/bun:latest AS base
WORKDIR /app

# install node modules
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# build for production
FROM base AS prerelease
WORKDIR /app
COPY --from=install /temp/prod/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

# expose dist folder
FROM alpine:latest AS final
WORKDIR /app
COPY --from=prerelease /app/dist ./dist

# export port 5173
EXPOSE 5173
