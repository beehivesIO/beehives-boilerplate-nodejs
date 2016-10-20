'use strict';

import Hapi from 'hapi';
import nodeDir from 'node-dir';
import good from 'good';
import suspend, { resume } from 'suspend';
import process from 'process';

suspend(function*() {
  const server = new Hapi.Server();
  const port = 9090; // DO NOT CHANGE IT. If you want to change it, see README.md

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
    const route = require('./' + routeFile);

    const routePath = routeFile
    .replace(/^routes/, '')
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
