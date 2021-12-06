const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');

const schemaCreateProject = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
});

const schemaNameProject = Joi.object({
  name: Joi.string().required(),
});

const schemaEmail = Joi.object({
  email: Joi.string().required(),
  //   email: Joi.string().email({
  //     minDomainSegments: 4,
  //     tlds: { allow: ['com', 'net', 'ua','ru','co'] },
  //   }).required(),
});

const schemaDescriptionProject = Joi.object({
  description: Joi.string().required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${err.message.replace(/"/g, '')}`,
    });
  }
};

const validateId = async (projectId, next) => {
  !mongoose.isValidObjectId(projectId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Project Id is not valid`,
    });

  next();
};

module.exports.validateCreateProject = (req, _res, next) => {
  return validate(schemaCreateProject, req.body, next);
};

module.exports.validateObjectId = (req, _res, next) => {
  return validateId(req.params.projectId, next);
};

module.exports.validateNameProject = (req, _res, next) => {
  return validate(schemaNameProject, req.body, next);
};

module.exports.validateEmail = (req, _res, next) => {
  return validate(schemaEmail, req.body, next);
};

module.exports.validateDescriptionProject = (req, _res, next) => {
  return validate(schemaDescriptionProject, req.body, next);
};
