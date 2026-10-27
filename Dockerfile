# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:22-alpine
RUN apk add --no-cache docker-cli

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/.output /app/.output

EXPOSE 3000

# Se mantiene el usuario por defecto (root) para poder acceder al socket de
# Docker montado desde el host. Ver README para ejecutar con usuario no-root.
CMD ["node", ".output/server/index.mjs"]
