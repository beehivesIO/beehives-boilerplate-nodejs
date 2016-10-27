FROM alpine

RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm i -g nodemon

VOLUME [ "/datas" ]
WORKDIR /datas

ENV NODE_ENV production

EXPOSE 9090

ENTRYPOINT npm start
