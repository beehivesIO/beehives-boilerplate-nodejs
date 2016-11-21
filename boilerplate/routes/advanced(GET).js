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
      text: `Congrats ${name}, you've created your first service on beehives :)\nThis request was a GET`
    });
  })
};
