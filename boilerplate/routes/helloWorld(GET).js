'use strict';

import suspend from 'suspend';

module.exports = {
  handler: suspend(function*(request, reply) {

    // Reply a simple text message
    reply('Congrats, you\'ve created your first service on beehives :)');
    
  })
};
