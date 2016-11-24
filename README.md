**You should not install this package manually!**

See https://www.beehives.io


### Note for boilerplate's developers

Link the dev version of this boilerplate:

```
npm link
```


Create a microservice to test the boilerplate:

```
beehives create test
cd test
npm link beehives-boilerplate-nodejs
npm start
```

Each time you'll make a change on the boilerplate, you'll have to link it again with `npm link`


To unlink the boilerplate, just uninstall it with `npm r -g beehives-boilerplate-nodejs`
