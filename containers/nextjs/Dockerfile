# Debian version musut be over 11 to run playwright/test
FROM node:16.20-bullseye
WORKDIR /nextjs
COPY ./next/ ./
RUN npm ci
RUN npx playwright install && npx playwright install-deps
