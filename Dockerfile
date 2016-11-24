FROM node:7.2.0

RUN curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 0.17.8

ENV PATH "/root/.yarn/bin:$PATH"
RUN yarn global add nodemon

VOLUME [ "/datas" ]
WORKDIR /datas

ENV NODE_ENV production

EXPOSE 9090

ENTRYPOINT yarn start
