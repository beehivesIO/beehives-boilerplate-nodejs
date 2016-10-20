'use strict';

import suspend from 'suspend';

module.exports = {
  handler: suspend(function*(request, reply) {
    reply('Congrats, you\'ve created your first service on servicesHub :)');
  })
};
