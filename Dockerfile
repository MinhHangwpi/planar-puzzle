# Use Node image to build
FROM node:18-slim AS builder
WORKDIR /app

# Install system dependencies for the 'canvas' library
RUN apt-get update && apt-get install -y \
    build-essential libcairo2-dev libpango1.0-dev \
    libjpeg-dev libgif-dev librsvg2-dev

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Nginx to serve the production build
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]