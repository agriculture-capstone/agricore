FROM node:8.9
#note docker node image comes with yarn

WORKDIR /agriculture-core/

#ADD . /agriculture-core/

RUN yarn install --frozen-lockfile

RUN npm run build

CMD [ "npm" , "start" ]
