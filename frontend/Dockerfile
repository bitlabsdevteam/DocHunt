FROM node:20-alpine AS build
WORKDIR /app

# Copy the base tsconfig from the monorepo root (referenced by extends)
COPY tsconfig.base.json ./tsconfig.base.json

# Copy frontend package files
COPY frontend/package.json ./frontend/package.json

# Install deps for frontend only
WORKDIR /app/frontend
RUN npm install --ignore-scripts

# Copy frontend source
COPY frontend/ ./

# Vite inlines VITE_* env vars at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
