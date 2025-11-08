# Build phase
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Output stage
FROM alpine:3.19 AS export
WORKDIR /app
COPY --from=build /app/dist ./dist
