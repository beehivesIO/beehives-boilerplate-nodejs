'use strict';

import suspend from 'suspend';
import joi from 'joi';

module.exports = {
  config: {
    notes: 'Return a JSON object with a congrats message and params received',
    validate: {
      query: {

        name: joi
          .string()
          .required()
          .description('user name'),

        age: joi
          .number()
          .integer()
          .min(18)
          .max(120)
          .description('user age'),

        email: joi
          .string()
          .email()
          .description('user email'),

        accessToken: joi
          .string()
          .regex(/^[a-fA-F0-9]{32}$/)
          .description('access token (32 hexadecimal characters)')
      }
    }
  },

  handler: suspend(function*(request, reply) {
    const { name, age, email, accessToken } = request.query;

    reply({
      text: `Congrats ${name}, you've created your first service on beehives :)\nThis request was a GET`,
      paramsReceived: { name, age, email, accessToken }
    });
  })
};
