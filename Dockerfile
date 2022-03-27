FROM node:lts-alpine3.14

RUN npm install -g typescript

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN tsc

EXPOSE ${PORT}

CMD ["node", "./build/app.js"]