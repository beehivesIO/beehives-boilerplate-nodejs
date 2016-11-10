#!/bin/sh

cp -fr boilerplate/. ../../
mv ../../.gitignoreToCopy ../../.gitignore
cd ../../
npm i --save babel-watch
