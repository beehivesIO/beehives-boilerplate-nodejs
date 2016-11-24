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
import documentationRoute from './documentationRoute';

suspend(function*() {

  const packageJson = require(__dirname + '/../package.json');

  // Create configuration file if not exists yet
  const lstat = yield fs.lstat('.beehives.json', resumeRaw());
  if (lstat[0]) {
    const name = path.basename(process.env.PWD);
    const beehivesJson = {
      boilerplate: 'nodejs',
      boilerplateVersion: packageJson.version,
      name
    };
    yield fs.writeFile(
      '.beehives.json',
      jsonFormat(beehivesJson),
      resume()
    );
  }


  const server = new Hapi.Server();
  const port = 9090;

  server.connection({ port });


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

    console.log(`\t- http://localhost:${port}${route.path} (${route.method})`);

    server.route(route);
  }


  // Add documentation route
  server.route(documentationRoute);


  // Start server
  yield server.start(resume());
  console.log(`
Your micro service is running :)
You can access to it through http://localhost:${port}

You can edit routes files in folder routes/

To deploy your service, simply use "beehives deploy"

Enjoy :)
`);

})();
