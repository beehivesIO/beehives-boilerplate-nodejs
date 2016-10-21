#!/bin/sh

npm i --save babel-watch
node_modules/.bin/babel-watch --watch routes/ --presets es2015 --plugins transform-object-rest-spread node_modules/.bin/services-hub-server-nodejs
