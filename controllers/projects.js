const Projects = require('../repository/projects');
const { HttpCode } = require('../helpers/constants');
const Sprint = require("../repository/sprints");
const Task = require("../repository/tasks");
const User = require("../repository/users");

const getAllProjects = async (req, res, next) => {
  const user = req.user;
  try {
    const projects = await Projects.listProjects(user);
    const newProjects = [];

    if ( projects ){

      for (const project of projects) {
        let newParticipants = [];
        for (const email of project.participants) {
          const participant = await User.findByEmail(email);
          if ( participant ){
            newParticipants.push(  {
              email: participant.email,
              avatar: participant.avatar
            })
          }else{
            newParticipants.push({email: email})
          }
        }

        newProjects.push({
            ...project._doc,
            id: project._id,
            participants: newParticipants
        })
      }
    }
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { projects: newProjects } });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const project = await Projects.addProject({ ...req.body, owner: userId });
    // console.log(project); // toObject
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { project } });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  // const userId = req.user.id;
  const user = req.user;
  const projectId = req.params.projectId;
  try {
    const project = await Projects.getById(user, projectId);
    // console.log(project); // toObject
    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } }); // toJSON
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

const deleteProject = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    const project = await Projects.removeProject(userId, projectId);
    if (project) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Project deleted',
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

const updateProjectName = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    if (typeof req.body.name === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field Name!',
      });
    }
    const project = await Projects.updateProject(userId, projectId, req.body);
    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } });
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

const updateProjectDescription = async (req, res, next) => {
  const userId = req.user.id;
  const projectId = req.params.projectId;
  try {
    if (typeof req.body.description === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field Description!',
      });
    }
    const project = await Projects.updateProject(userId, projectId, req.body);
    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } });
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

const addParticipant = async (req, res, next) => {
  const userId = req.user.id; // TODO  userId  проверить используется ли в итоге
  const projectId = req.params.projectId;
  try {
    if (typeof req.body.email === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field Email!',
      });
    }
    const project = await Projects.updateParticipants(
      userId,
      projectId,
      req.body,
    );
    if (project) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { project } });
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

const deleteParticipant = async (req, res, next) => {
  const userId = req.user.id; // TODO  userId  проверить используется ли в итоге
  const projectId = req.params.projectId;
  try {
    const project = await Projects.removeParticipant(
      userId,
      projectId,
      req.body,
    );
    if (project) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Participant deleted',
        data: { project },
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

const getStatistics = async (req, res, next) => {
  const projectId = req.params.projectId;
  let results = [];
  
  try {
    const sprints = await Sprint.getAllSprints(projectId);

    for (const sprint of sprints) {
      const tasks = await Task.allTasks(sprint.id);
      let sum = 0;
      for (const task of tasks) {
        sum += task.totalTime;
      }

      if ( tasks ){
        results.push({
          name: (sprint.name.length > 9 ) ? sprint.name.slice(0,9) + '...' : sprint.name,
          scheduled: sprint.allScheduledTime,
          spent: sum
        })
      }

    }

    if (sprints) {
      return res
          .status(HttpCode.OK)
          .json({ status: 'success', code: HttpCode.OK, data: results });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
}

const setFavorite = async (req, res, next) => {
  const projectId = req.params.projectId;
  const user = req.user;

  try {
    const findProject = await Projects.getById(user, projectId);
    const data = {
      favorite: !findProject.favorite
    }
    const sprints = await Projects.updateProject(user, projectId, data);

    if (sprints) {
      return res
          .status(HttpCode.OK)
          .json({ status: 'success', code: HttpCode.OK});
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
}


// const getParticipants = async (req, res, next) => {
//   const userId = req.user.id;
//   const { projectId } = req.params;
//   try {
//     const project = await Projects.getById(userId, projectId);
//     const { participants } = project;
//     if (project) {
//       return res
//         .status(HttpCode.OK)
//         .json({ status: 'success', code: HttpCode.OK, data: { participants } }); // toJSON
//     }
//     return res.status(HttpCode.NOT_FOUND).json({
//       status: 'error',
//       code: HttpCode.NOT_FOUND,
//       message: 'Not found',
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  deleteProject,
  updateProjectName,
  addParticipant,
  deleteParticipant,
  updateProjectDescription,
  getStatistics,
  setFavorite
};
