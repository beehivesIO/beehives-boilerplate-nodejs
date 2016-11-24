FROM node:latest

RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN yarn install -g nodemon

VOLUME [ "/datas" ]
WORKDIR /datas

ENV NODE_ENV production

EXPOSE 9090

ENTRYPOINT yarn start
