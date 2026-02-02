FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies (cache-friendly)
COPY package*.json ./
RUN npm ci

# Copy source and build for production
COPY . .

RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config from deploy/nginx
COPY deploy/nginx.conf.templates /etc/nginx/templates/default.conf.template
#COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
