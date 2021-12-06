const mongoose = require('mongoose');
const Joi = require('joi');

const { HttpCode } = require('../helpers/constants');

const schemaCreateSprint = Joi.object({
  name: Joi.string().required(),
  startDate: Joi.date().required().messages({
    'date.base': `startDate should be YYYY-MM-DD`,
  }),
  duration: Joi.number().required(),
});

const schemaUpdateSprint = Joi.object({
  name: Joi.string().required(),
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

const validateId = async (projectId, sprintId, next) => {
  projectId &&
    !mongoose.isValidObjectId(projectId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Project Id is not valid`,
    });

  sprintId &&
    !mongoose.isValidObjectId(sprintId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Sprint Id is not valid`,
    });

  next();
};

module.exports.validateCreateSprint = (req, _res, next) => {
  return validate(schemaCreateSprint, req.body, next);
};

module.exports.validateUpdateSprint = (req, _res, next) => {
  return validate(schemaUpdateSprint, req.body, next);
};

module.exports.validateObjectId = (req, _res, next) => {
  return validateId(req.params.projectId, req.params.sprintId, next);
};
