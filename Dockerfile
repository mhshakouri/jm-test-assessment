# Base image with Node on Alpine (small size)
FROM node:lts-alpine AS base
WORKDIR /app

# Install dependencies with pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source code and build client + server bundles
COPY . .
RUN pnpm run build

# Production runtime image
FROM node:lts-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy only what the runtime needs
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/server.ts ./server.ts
COPY --from=base /app/index.html ./index.html
COPY --from=base /app/package.json ./package.json

EXPOSE 3000

# Run the same server entry used by `pnpm preview`
CMD ["./node_modules/.bin/tsx", "server.ts"]
