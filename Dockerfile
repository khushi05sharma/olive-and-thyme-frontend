FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept VITE_API_URL as a build argument, default to localhost if not provided
ARG VITE_API_URL=http://localhost:5000
ARG VITE_SPOONACULAR_KEY=
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SPOONACULAR_KEY=${VITE_SPOONACULAR_KEY}

RUN npm run build

# ---- Stage 2: Serve ----

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
