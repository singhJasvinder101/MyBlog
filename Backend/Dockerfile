FROM node:22-alpine3.19
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD ["node", "server.js"]
