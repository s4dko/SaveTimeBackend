const mongoose = require('mongoose');
const Joi = require('joi');
const { HttpCode } = require('../helpers/constants');

const schemaCreateTask = Joi.object({
  name: Joi.string().required(),
  scheduledTime: Joi.number().required(),
  totalTime: Joi.number().optional(),
  // isDone: Joi.boolean().optional(),
});

const validate = async (schema, body, next) => {
  try {
    if (Object.keys(body).length !== 0) {
      await schema.validateAsync(body);
      next();
    } else {
      next({ status: HttpCode.BAD_REQUEST, message: `Fields are missing` });
    }
  } catch (err) {
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, '')}`,
    });
  }
};

const validateId = async (projectId, sprintId, taskId, next) => {
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

  taskId &&
    !mongoose.isValidObjectId(taskId) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `Task Id is not valid`,
    });

  next();
};

module.exports.validateUpdTask = async (req, _res, next) => {
  const isNormalInteger = value => /^\+?(0|[1-9]\d*)$/.test(value);

  const isValidDate = value =>
    /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(value);

  const { day, value } = req.params;

  !isValidDate(day) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `day should be YYYY-MM-DD`,
    });

  !isNormalInteger(value) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `value must be number`,
    });

  next();
};

module.exports.validateCreateTask = (req, _res, next) => {
  return validate(schemaCreateTask, req.body, next);
};

module.exports.validateObjectId = (req, _res, next) => {
  return validateId(
    req.params.projectId,
    req.params.sprintId,
    req.params.taskId,
    next,
  );
};

module.exports.validateGetTaskByDay = async (req, _res, next) => {
  const isValidDate = value =>
    /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(value);

  const { day } = req.params;

  !isValidDate(day) &&
    next({
      status: HttpCode.BAD_REQUEST,
      message: `day should be YYYY-MM-DD`,
    });

  next();
};

// TODO: поправить валидацию даты
