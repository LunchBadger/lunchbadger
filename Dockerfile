FROM node:6

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

RUN git config --global user.email "support@lunchbadger.com" && \
    git config --global user.name "LunchBadger"
RUN npm install loopback-connector-rest \
                loopback-connector-mongodb \
                loopback-connector-redis \
                loopback-connector-mysql \
                LunchBadger/loopback-connector-salesforce

COPY . /usr/src/app
ENV NODE_ENV production

CMD [ "npm", "start" ]
