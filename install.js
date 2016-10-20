'use strict';

import suspend, { resume, resumeRaw } from 'suspend';
import fsExtra from 'fs-extra';
import fs from 'fs';

suspend(function*() {

  // Install boilerplate if not yet installed
  const lstat = yield fs.lstat('./.servicesHub.json', resumeRaw());
  if (!lstat[0]) {
    yield fsExtra.copy('./node_modules/services-hub-boilerplate-nodejs/boilerplate', '.', resume());
  }
})();
