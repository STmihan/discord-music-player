FROM node:20

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm install

WORKDIR /app/server
RUN npm install

WORKDIR /app
COPY . .

RUN npm run build

CMD ["npm", "start", "--prefix", "server"]
