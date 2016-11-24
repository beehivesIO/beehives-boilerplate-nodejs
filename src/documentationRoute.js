'use strict';

import suspend, { resume } from 'suspend';
import fs from 'fs';
import joi from 'joi';
import joiToJsonSchema from 'joi-to-json-schema';
import nodeDir from 'node-dir';


module.exports = {
  path: '/beehivesDocumentation',
  method: 'GET',
  handler: suspend(function*(request, reply) {

    // Get README.md content
    let readme = '';
    try {
      readme = yield fs.readFile(process.cwd() + '/README.md', 'utf8', resume());
    }
    catch (err) {};

    // Load routes datas
    let routes = [];
    const routesFiles = yield nodeDir.files(process.cwd() + '/routes/', resume());
    for (const routeFile of routesFiles) {
      const routePath = routeFile
      .replace(process.cwd() + '/routes', '')
      .replace(/\.js$/, '')
      .replace(/\((?:GET|POST|PUT|PATCH|DELETE|OPTIONS|\*|\|)+\)$/, '')
      .replace(/_default$/, '');
      const path = routePath;

      const methodsString = routeFile.match(/\(((?:GET|POST|PUT|PATCH|DELETE|OPTIONS|\*|\|)+)\)\.js$/);
      const methods = methodsString ? methodsString[1].split('|') : '*';

      const route = require(routeFile);
      const jsonSchema = joiToJsonSchema(joi.object(route.validate));
      routes.push({
        path,
        methods,
        jsonSchema
      });
    }

    reply({
      readme,
      routes
    });
  })
};
