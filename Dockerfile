FROM node:alpine

WORKDIR /usr/src

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ENV GRAPHQL_URL "https://doowit-server.grmiade.tech/graphql"
ENV GRAPHQL_WEBSOCKET "wss://doowit-server.grmiade.tech/graphql"

RUN npm run-script build && mv dist /public
