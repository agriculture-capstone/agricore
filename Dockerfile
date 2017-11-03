FROM node:8.9
#note docker node image comes with yarn

WORKDIR /agriculture-core/

RUN yarn install --frozen-lockfile

RUN npm start:prod
