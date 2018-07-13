FROM node:8-alpine

RUN apk update && apk add git && apk add openssh

RUN mkdir -p /usr/src/app/workspace
WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN git config --global user.email "support@lunchbadger.com" && \
    git config --global user.name "LunchBadger"
RUN npm install loopback-connector-rest \
                loopback-connector-mongodb \
                loopback-connector-redis \
                loopback-connector-mysql \
                loopback-connector-soap \
                loopback-connector-postgresql \
                loopback-connector-manta \
                LunchBadger/loopback-connector-salesforce#no-cldr \ 
                AdChain/loopback-connector-web3 \
                js-sha256 \
                socket.io \
                ethereumjs-testrpc

RUN npm install

COPY . /usr/src/app

ENV NODE_ENV production


ENTRYPOINT for i in $(env | grep '_SERVICE_\|_PORT' | cut -f1 -d=); do unset $i; done; node .
