const Task = require('../model/task');

const createTask = async body => {
  return await Task.create(body);
};

const getTaskById = async (sprintId, taskId) => {
  return await Task.findOne({
    _id: taskId,
    sprint: sprintId,
  });
};

const updateTask = async (
  sprintId,
  taskId,
  taskByDays,
  totalTime,
  taskByDaysForDiagram,
) => {
  const result = await Task.findOneAndUpdate(
    {
      _id: taskId,
      sprint: sprintId,
    },
    {
      taskByDays,
      totalTime,
      taskByDaysForDiagram,
    },
    { new: true },
  );
  return result;
};

const allTasks = async sprintId => {
  return await Task.find({ sprint: sprintId });
};

const removeTask = (sprintId, id) => {
  return Task.findByIdAndRemove({ _id: id, sprint: sprintId });
};

module.exports = {
  createTask,
  getTaskById,
  updateTask,
  allTasks,
  removeTask,
};
