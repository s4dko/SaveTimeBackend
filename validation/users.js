const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');

const schemaSignupUser = Joi.object({
  name: Joi.string().min(2).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ua', 'co'] },
    })
    .required(),
  password: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

const schemaSigninUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['co', 'com', 'net', 'ua'] },
    })
    .required(),
  password: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

const schemaEmail = Joi.object({
  email: Joi.string().required(),
  // email: Joi.string()
  //   .email({
  //     minDomainSegments: 4,
  //     tlds: { allow: ['com', 'net', 'ua', 'ru', 'co'] },
  //   })
  //   .required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (error) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${error.message.replace(/"/g, '')}`,
    });
  }
};

module.exports.validateSignupUser = (req, _res, next) => {
  return validate(schemaSignupUser, req.body, next);
};

module.exports.validateLoginUser = (req, _res, next) => {
  return validate(schemaSigninUser, req.body, next);
};

module.exports.validateEmail = (req, _res, next) => {
  return validate(schemaEmail, req.body, next);
};
