#!/bin/bash

node node_modules/beehives-boilerplate-nodejs/build/installation.js

./node_modules/babel-watch/babel-watch.js \
  --watch routes/ \
  --presets es2015 \
  --plugins transform-object-rest-spread \
  node_modules/beehives-boilerplate-nodejs/build/server.js
