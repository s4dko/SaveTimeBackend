const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');
const ctrl = require('../../controllers/sprints');
const valid = require('../../validation/sprints');

router.post(
  '/:projectId',
  guard,
  valid.validateObjectId,
  valid.validateCreateSprint,
  ctrl.createSprint,
);

router.get('/:projectId', guard, valid.validateObjectId, ctrl.getAllSprints);

router.patch(
  '/:projectId/:sprintId/name',
  guard,
  valid.validateObjectId,
  valid.validateUpdateSprint,
  ctrl.updateSprint,
);

router.delete(
  '/:projectId/:sprintId',
  guard,
  valid.validateObjectId,
  ctrl.deleteSprint,
);

router.get(
  '/:projectId/:sprintId',
  guard,
  valid.validateObjectId,
  ctrl.getSprintById,
);

module.exports = router;
