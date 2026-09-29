# 1) Build the React app into static files
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_BASE=http://localhost:5001
ENV REACT_APP_API_BASE=$REACT_APP_API_BASE
RUN npm run build

# 2) Serve them with nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
