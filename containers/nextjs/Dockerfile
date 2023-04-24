# Nest.js fetch() doesn't work unless node16
# Debian version musut be over 11 to run playwright/test
FROM node:16.20-bullseye AS dev
WORKDIR /nextjs
COPY ./next/package.json ./next/package-lock.json ./
RUN npm ci
RUN npx playwright install && npx playwright install-deps
COPY ./next/ ./

FROM node:16.20-bullseye-slim
WORKDIR /nextjs
COPY --from=dev /nextjs/ ./
