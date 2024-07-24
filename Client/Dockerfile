FROM node:22-alpine3.19 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
FROM ubuntu:latest

WORKDIR /app
COPY --from=build /app/dist /app/dist

RUN apt-get update && apt-get install -y npm
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
