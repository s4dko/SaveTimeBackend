const Project = require('../model/project');
const Sprint = require('../model/sprint');
const Task = require('../model/task');

const addProject = async body => {
  const result = await Project.create(body);
  return result;
};

const listProjects = async user => {
  const results = await Project.find(
    {
      $or: [{ owner: user.id }, { participants: user.email }],
    },
    // { participants: 0 }, // позволяет вернуть данные без указанного поля
  ).populate({ path: 'owner', select: 'name email _id' });
  return results;
};

const getById = async (user, projectId) => {
  const result = await Project.findOne({
    _id: projectId,
    $or: [{ owner: user.id }, { participants: user.email }],
  }).populate({ path: 'owner', select: 'name email _id' }); // .populate({}) позволяет показывать не просто id пользователя, а ту информацию,кот.указываем в select, "-"-убирает ненужные поля
  return result;
};

const removeProject = async (userId, projectId) => {
  const result = await Project.findOneAndRemove({
    _id: projectId,
    owner: userId,
  });
  if (result) {
    await Sprint.deleteMany({
      project: projectId,
    });
    await Task.deleteMany({
      project: projectId,
    });
  }
  return result;
};

const updateProject = async (userId, projectId, body) => {
  const result = await Project.findOneAndUpdate(
    {
      _id: projectId,
      owner: userId, // позволяет менять Name или  Description только owner
    },
    { ...body },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email _id',
  });

  return result;
};

const updateParticipants = async (_userId, projectId, body) => {
  const newParticipant = [body.email];

  const result = await Project.findOneAndUpdate(
    {
      _id: projectId,
      // owner: userId, // позволяет добавлят participants только owner
    },
    { $addToSet: { participants: newParticipant } }, // $addToSet добавляет данные, если их еще нет в массиве:
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email _id',
  });

  return result;
};

const removeParticipant = async (_userId, projectId, body) => {
  const result = await Project.findOneAndUpdate(
    {
      _id: projectId,
      // owner: userId, // позволяет удалять participants только owner
    },
    { $pull: { participants: body.email } }, // $pull удаляет по значению
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email _id',
  });

  return result;
};

module.exports = {
  addProject,
  listProjects,
  getById,
  removeProject,
  updateProject,
  updateParticipants,
  removeParticipant
};
