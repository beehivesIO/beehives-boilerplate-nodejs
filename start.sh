
# TODO:
# - ignore all on node_modules except services-hub-boilerplate-nodejs

./node_modules/.bin/babel-node \
  --ignore ^\.\/node_modules\/(?:(?!services-hub-boilerplate-nodejs).).* \
  ./node_modules/services-hub-boilerplate-nodejs/install.js

./node_modules/.bin/babel-node \
  --ignore ^\.\/node_modules\/(?:(?!services-hub-boilerplate-nodejs).).* \
  ./node_modules/services-hub-boilerplate-nodejs/server.js


# TODO:
# - use docker
# - push repository to github
# - push repository to npm
# - remove sinopia
# - create a readme on services-hub about sinopia


# SERVICENAME=$1
# PORT=$2
#
# docker build -t $SERVICENAME -f Dockerfile .
# docker run -t -i -p $PORT:9090 -v $PWD:/datas $SERVICENAME
