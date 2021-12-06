const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');
const ctrl = require('../../controllers/tasks');
const valid = require('../../validation/tasks');

router.post(
  '/:projectId/:sprintId',
  guard,
  valid.validateObjectId,
  valid.validateCreateTask,
  ctrl.createTask,
);

router.patch(
  '/:sprintId/:taskId/day=:day/value=:value',
  guard,
  valid.validateObjectId,
  valid.validateUpdTask,
  ctrl.updateTask,
);

router.get(
  '/:sprintId/byday=:day',
  guard,
  valid.validateObjectId,
  valid.validateGetTaskByDay,
  ctrl.getTaskByDay,
);

router.get(
  '/:sprintId/:taskId',
  guard,
  valid.validateObjectId,
  ctrl.getTaskById,
);

router.get('/:sprintId', guard, valid.validateObjectId, ctrl.getAllTasks);

router.delete(
  '/:sprintId/:taskId',
  guard,
  valid.validateObjectId,
  ctrl.deleteTask,
);

module.exports = router;
