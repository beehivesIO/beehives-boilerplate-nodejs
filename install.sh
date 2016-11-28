#!/bin/sh

cd ../../

if [ -x "$(which yarn)" ]
then
  yarn add \
    babel-watch \
    babel-plugin-transform-object-rest-spread \
    babel-polyfill \
    babel-preset-es2015
else
  npm install --save \
    babel-watch \
    babel-plugin-transform-object-rest-spread \
    babel-polyfill \
    babel-preset-es2015
fi
