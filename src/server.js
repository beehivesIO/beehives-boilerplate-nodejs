#!/usr/bin/env node

'use strict';

import 'babel-polyfill';
import Hapi from 'hapi';
import nodeDir from 'node-dir';
import good from 'good';
import suspend, { resume, resumeRaw } from 'suspend';
import process from 'process';
import path from 'path';
import fs from 'fs';
import jsonFormat from 'json-format';

import Inert from 'inert';
import Vision from 'vision';
import HapiSwagger from 'hapi-swagger';

suspend(function*() {

  const packageJson = require(__dirname + '/../package.json');

  // Create configuration file if not exists yet
  const lstat = yield fs.lstat(process.cwd() + '/.beehives.json', resumeRaw());
  if (lstat[0]) {
    const name = path.basename(process.env.PWD);
    const beehivesJson = {
      boilerplate: 'nodejs',
      boilerplateVersion: packageJson.version,
      name,
      version: '0.0.1'
    };
    yield fs.writeFile(
      '.beehives.json',
      jsonFormat(beehivesJson),
      resume()
    );
  }
  const beehivesConf = JSON.parse(yield fs.readFile(process.cwd() + '/.beehives.json', 'utf8', resume()));


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
        info: {
          title: beehivesConf.name,
          version: beehivesConf.version,
          description: yield fs.readFile(process.cwd() + '/README.md', 'utf8', resume())
        }
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
The documentation is auto generated at http://localhost:${port}/documentation

You can edit routes files in folder routes/

To deploy your service, simply use "beehives deploy"

Enjoy :)
`);

})();
