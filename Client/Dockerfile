FROM node:22-alpine3.19 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_FIREBASE_APIKEY
ARG VITE_API_URI
ARG VITE_HF_ACCESS_TOKEN

ENV VITE_FIREBASE_APIKEY=$VITE_FIREBASE_APIKEY
ENV VITE_API_URI=$VITE_API_URI
ENV VITE_HF_ACCESS_TOKEN=$VITE_HF_ACCESS_TOKEN

RUN echo $VITE_FIREBASE_APIKEY
RUN echo $VITE_API_URI
RUN echo $VITE_HF_ACCESS_TOKEN

RUN npm run build

FROM node:22-alpine3.19

WORKDIR /app
COPY --from=build /app/dist /app/dist

RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]


