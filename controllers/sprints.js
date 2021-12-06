const Sprints = require('../repository/sprints');
const { HttpCode } = require('../helpers/constants');

const createSprint = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const sprint = await Sprints.addSprint({
      ...req.body,
      project: projectId,
    });
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { sprint } });
  } catch (error) {
    next(error);
  }
};

const getAllSprints = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const sprints = await Sprints.getAllSprints(projectId);
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { sprints } });
  } catch (error) {
    next(error);
  }
}; 

const getSprintById = async (req, res, next) => {
  const { projectId, sprintId } = req.params;
  try {
    const sprint = await Sprints.getById(projectId, sprintId);
    if (sprint) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { sprint } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const deleteSprint = async (req, res, next) => {
  const { projectId, sprintId } = req.params;

  try {
    const sprint = await Sprints.removeSprint(projectId, sprintId);
    if (sprint) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Sprint deleted',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const updateSprint = async (req, res, next) => {
  const { projectId, sprintId } = req.params;

  try {
    if (typeof req.body.name === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field Name!',
      });
    }
    const sprint = await Sprints.updateSprint(projectId, sprintId, req.body);
    if (sprint) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { sprint } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSprint,
  getAllSprints,
  getSprintById,
  deleteSprint,
  updateSprint,
};
