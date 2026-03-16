FROM node:20-alpine AS build
WORKDIR /app

# Copy the base tsconfig from the monorepo root
COPY tsconfig.base.json ./tsconfig.base.json

# Copy backend package files
COPY backend/package.json ./backend/package.json

# Install deps
WORKDIR /app/backend
RUN npm install --ignore-scripts

# Copy backend source
COPY backend/ ./

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/backend/package.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --from=build /app/backend/dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
