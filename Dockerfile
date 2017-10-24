FROM node:8-alpine

RUN apk update && apk add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --unsafe-perm

RUN git config --global user.email "support@lunchbadger.com" && \
    git config --global user.name "LunchBadger"
RUN npm install loopback-connector-rest \
                loopback-connector-mongodb \
                loopback-connector-redis \
                loopback-connector-mysql \
                loopback-connector-manta \
                # eslint@3.19 \
                # LunchBadger/loopback-connector-salesforce \
                AdChain/loopback-connector-web3 \
                js-sha256 \
                socket.io \
                ethereumjs-testrpc
COPY . /usr/src/app
ENV NODE_ENV production
CMD [ "npm", "start" ]