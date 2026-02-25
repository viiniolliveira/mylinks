# syntax=docker/dockerfile:1

# base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# deps
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# build
FROM base AS build
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

# 1. Injetamos uma URL falsa apenas para o build passar!
ENV DATABASE_URL=postgresql://fake:fake@localhost:5432/fake

RUN bun run db:generate

ENV NODE_ENV=production
RUN bun run build

# runtime
FROM oven/bun:1 AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# traz o client e dependências do build (sem tentar copiar .prisma separado)
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/prisma.config.ts ./prisma.config.ts

USER bun
EXPOSE 8000


CMD ["bun", "dist/index.js"]