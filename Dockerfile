FROM node:12-alpine AS build
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY public/ ./public/
COPY src/ ./src/
COPY babel-plugin-macros.config.js tsconfig.json ./
ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_GRAPHQL_WEBSOCKET
RUN yarn run build

FROM nginx:alpine
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /var/www/html
EXPOSE 80
