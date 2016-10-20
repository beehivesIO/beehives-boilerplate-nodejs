'use strict';

import suspend from 'suspend';
import joi from 'joi';

module.exports = {
  config: {
    validate: {
      query: {
        name: joi.string().required()
      }
    }
  },

  handler: suspend(function*(request, reply) {
    const { name } = request.query;

    reply({
      text: `Congrats ${name}, you've created your first service on servicesHub :)\nThis request was a GET`
    });
  })
};
