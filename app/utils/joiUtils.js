const Joi = require('joi');

const joiUtils = {};

joiUtils.Joi = Joi.extend((Joi) => ({
  type: 'string',
  base: Joi.string(),
  messages: {
    'string.objectId': '{{#label}} must be a valid id',
    'string.emailMessage': '{{#label}} must be a valid email',
    'string.invalidTimeZone': '{{#label}} must be a valid timezone.',
    'string.ethereumAddress': '{{#label}} must be a valid ethereum addresses.',
    'string.imageUrl': '{{#label}} must be a valid image url or invalid image extension.',
  },
  rules: {
    isValidEmail: {
      validate(value, helpers) {
        const filter = /^([\w]+)(.[\w]+)*@([\w]+)(.[a-z]{2,3}){1,2}$/;
        if (filter.test(value.toLowerCase())) {
          return value.toLowerCase();
        }
        return helpers.error('string.emailMessage');
      },
    }
  },
}));



module.exports = joiUtils;
