FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

WORKDIR /app/discord-bot
COPY discord-bot/package*.json ./
RUN npm install

WORKDIR /app

EXPOSE 5000

CMD ["sh", "-c", "node server.js & node discord-bot/src/index.js"]
