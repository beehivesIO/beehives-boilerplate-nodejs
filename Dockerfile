FROM alpine

RUN apk update && apk upgrade
RUN apk add nodejs
RUN npm i -g nodemon

VOLUME [ "/datas" ]
RUN ls -al /datas/
WORKDIR /datas

EXPOSE 8080

ENTRYPOINT npm start
