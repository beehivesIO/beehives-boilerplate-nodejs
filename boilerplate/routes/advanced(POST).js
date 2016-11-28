'use strict';

import suspend from 'suspend';
import joi from 'joi';

module.exports = {
  config: {
    description: 'An advanced route',
    notes: 'Return a JSON object with a congrats message',
    validate: {
      payload: {

        name: joi
          .string()
          .required()
          .description('The user name')
          
      }
    }
  },

  handler: suspend(function*(request, reply) {
    const { name } = request.payload;

    reply({
      text: `Congrats ${name}, you've created your first service on beehives :)\nThis request was a POST`
    });
  })
};
