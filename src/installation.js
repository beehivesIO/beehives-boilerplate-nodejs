#!/usr/bin/env node

'use strict';

import 'babel-polyfill';
import suspend, { resume, resumeRaw } from 'suspend';
import process from 'process';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import jsonFormat from 'json-format';

suspend(function*() {
  const packageJson = require(__dirname + '/../package.json');

  // Create configuration file if not exists yet
  const lstat = yield fs.lstat('.beehives.json', resumeRaw());
  // Initialize project
  if (lstat[0]) {
    // Copy boilerplate files
    yield fsExtra.copy(
      __dirname + '/../boilerplate/',
      process.cwd(),
      { clobber: false },
      resume()
    );

    // Rename gitignore file
    yield fsExtra.move(
      '.gitignoreToCopy',
      '.gitignore',
      { clobber: false },
      resume()
    );

    // Update content of beehives.json
    const name = path.basename(process.env.PWD);
    let beehivesJson = yield fs.readFile('.beehives.json', 'utf8', resume());
    beehivesJson = JSON.parse(beehivesJson);
    beehivesJson = Object.assign(beehivesJson, {
      boilerplateVersion: packageJson.version,
      name
    });
    yield fs.writeFile(
      '.beehives.json',
      jsonFormat(beehivesJson),
      resume()
    );
  }
})();
