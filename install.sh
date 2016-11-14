#!/bin/sh

cp -fr boilerplate/. ../../
mv ../../.gitignoreToCopy ../../.gitignore
cd ../../
npm i --save babel-watch
npm i --save babel-plugin-transform-object-rest-spread
npm i --save babel-polyfill
npm i --save babel-preset-es2015
