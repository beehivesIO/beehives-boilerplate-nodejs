#!/bin/bash

if [[ "$NODE_ENV" == "production" ]]
then
  yarn install
fi

node_modules/.bin/babel-watch --watch routes/ --presets es2015 --plugins transform-object-rest-spread node_modules/.bin/beehives-server-nodejs
