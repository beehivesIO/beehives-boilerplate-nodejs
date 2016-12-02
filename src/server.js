#!/usr/bin/env node

'use strict';

import 'babel-polyfill';
import Hapi from 'hapi';
import nodeDir from 'node-dir';
import good from 'good';
import suspend, { resume } from 'suspend';
import process from 'process';
import fs from 'fs';
import HapiSwagger from 'hapi-swagger';
import Inert from 'inert';
import Vision from 'vision';

suspend(function*() {
  const beehivesConf = JSON.parse(yield fs.readFile('.beehives.json', 'utf8', resume()));


  const server = new Hapi.Server();
  const port = 9090;

  server.connection({
    port,
    routes: {
      cors: true
    }
  });


  // Log to console in dev mode
  if (process.env.NODE_ENV !== 'production') {
    yield server.register({
      register: good,
      options: {
        ops: false,
        reporters: {
          console: [ { module: 'good-console' }, 'stdout' ]
        }
      }
    }, resume());
  }


  // Add support for Swagger
  yield server.register([
    Inert,
    Vision,
    {
      register: HapiSwagger,
      options: {
        schemes: [ 'https' ],
        payloadType: 'form',
        consumes: [ 'application/form-data' ],
        // documentationPage: false,
        // swaggerUI: false,
        info: {
          title: beehivesConf.name,
          version: beehivesConf.version,
          description: yield fs.readFile('README.md', 'utf8', resume())
        },
        consumes: [ 'application/form-data' ]
      }
    }], resume());


  // Load route
  console.log('Loading routes:');
  const routesFiles = yield nodeDir.files(process.cwd() + '/routes/', resume());
  for (const routeFile of routesFiles) {
    const route = require(routeFile);

    const routePath = routeFile
    .replace(process.cwd() + '/routes', '')
    .replace(/\.js$/, '')
    .replace(/\((?:GET|POST|PUT|PATCH|DELETE|OPTIONS|\*|\|)+\)$/, '')
    .replace(/_default$/, '');
    route.path = routePath;

    const methodsString = routeFile.match(/\(((?:GET|POST|PUT|PATCH|DELETE|OPTIONS|\*|\|)+)\)\.js$/);
    route.method = methodsString ? methodsString[1].split('|') : '*';

    // For Swagger
    route.config = route.config || {};
    route.config.tags = route.config.tags || [ 'api' ];

    console.log(`\t- http://localhost:${port}${route.path} (${route.method})`);

    server.route(route);
  }


  // Start server
  yield server.start(resume());
  console.log(`
Your micro service is running :)

You can edit routes files in folder routes/

To deploy your service, simply use "beehives deploy"

Enjoy :)
`);

})();
