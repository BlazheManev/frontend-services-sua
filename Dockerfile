FROM node:20.10.0-alpine3.18
WORKDIR  /app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 11009

CMD [ "npx", "serve", "-s", "-l", "11009", "build" ]
