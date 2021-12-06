const express = require('express');
const router = express.Router();
const guard = require('../../helpers/guard');

const valid = require('../../validation/projects');

const ctrl = require('../../controllers/projects');

router.get('/', guard, ctrl.getAllProjects);

router.get('/:projectId', guard, valid.validateObjectId, ctrl.getProjectById);

router.post('/', guard, valid.validateCreateProject, ctrl.createProject);

router.delete('/:projectId', guard, valid.validateObjectId, ctrl.deleteProject);

router.patch(
  '/:projectId/name',
  guard,
  valid.validateObjectId,
  valid.validateNameProject,
  ctrl.updateProjectName,
); 

router.patch(
  '/:projectId/description',
  guard,
  valid.validateObjectId,
  valid.validateDescriptionProject,
  ctrl.updateProjectDescription,
); 

router.patch(
  '/:projectId/participant',
  guard,
  valid.validateObjectId,
  valid.validateEmail,
  ctrl.addParticipant,
); 

router.post(
  '/:projectId/participant',
  guard,
  valid.validateObjectId,
  valid.validateEmail,
  ctrl.deleteParticipant,
);

router.get(
    '/:projectId/statistics',
    guard,
    valid.validateObjectId,
    ctrl.getStatistics
);

router.post(
    '/:projectId/setFavorite',
    guard,
    valid.validateObjectId,
    ctrl.setFavorite,
);
module.exports = router;
