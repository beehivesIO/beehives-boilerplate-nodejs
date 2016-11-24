#!/bin/sh

cp -fr boilerplate/. ../../
mv ../../.gitignoreToCopy ../../.gitignore
cd ../../
yarn add babel-watch babel-plugin-transform-object-rest-spread babel-polyfill babel-preset-es2015
