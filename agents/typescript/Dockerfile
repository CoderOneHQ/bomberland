FROM node:12.19.0-alpine3.9
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

WORKDIR /app
RUN yarn install
COPY . /app/
RUN yarn build
ENTRYPOINT yarn run run