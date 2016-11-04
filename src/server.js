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

suspend(function*() {

  // Create configuration file if not exists yet
  const lstat = yield fs.lstat('.servicesHub.json', resumeRaw());
  if (lstat[0]) {
    const name = path.basename(process.env.PWD);
    const servicesHubJson = {
      boilerplate: 'nodejs',
      boilerplateVersion: '0.0.1',
      name
    };
    yield fs.writeFile(
      '.servicesHub.json',
      jsonFormat(servicesHubJson),
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
  const routesFiles = yield nodeDir.files(process.cwd() + '/routes/', resume());
  for (const routeFile of routesFiles) {
    console.log(routeFile);
    const route = require(routeFile);

    const routePath = routeFile
    .replace(process.cwd() + '/routes', '')
    .replace(/\.js$/, '')
    .replace(/\((?:GET|POST|PUT|PATCH|DELETE|OPTIONS|\*|\|)+\)$/, '')
    .replace(/_default$/, '');
    route.path = routePath;

    const methodsString = routeFile.match(/\(((?:GET|POST|PUT|PATCH|DELETE|OPTIONS|\*|\|)+)\)\.js$/);
    route.method = methodsString ? methodsString[1].split('|') : '*';

    server.route(route);
  }

  // Start server
  yield server.start(resume());
  console.log('Server is running');

})();
