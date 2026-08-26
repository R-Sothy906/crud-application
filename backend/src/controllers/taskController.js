import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

// Create Task
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  // Check title
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Please enter task title'
    });
  }

  // Check duplicate task for current user
  const existingTask = await Task.findOne({
    title,
    user: req.userId
  });

  if (existingTask) {
    return res.status(400).json({
      success: false,
      message: 'This task already exists, please use a different title'
    });
  }

  // Create task
  const newTask = await Task.create({
    title,
    description,
    status: status || 'pending',
    dueDate,
    user: req.userId
  });

  // Populate user name
  await newTask.populate('user', 'name');

  return res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      dueDate: newTask.dueDate,
      user: newTask.user.name
    }
  });
});


// Get All Tasks
export const getAllTask = asyncHandler(async (req, res) => {
  const {
    status,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // Only current user's tasks
  const filter = {
    user: req.userId
  };

  if (status) {
    filter.status = status;
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const sort = {
    [sortBy]: sortOrder
  };

  const tasks = await Task.find(filter)
    .populate('user', 'name')
    .sort(sort);

  return res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});


// Get Task By ID
export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({
    _id: id,
    user: req.userId
  }).populate('user', 'name');

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  return res.status(200).json({
    success: true,
    data: task
  });
});


// Update Task
export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    status,
    dueDate
  } = req.body;

  const task = await Task.findOne({
    _id: id,
    user: req.userId
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  task.title = title ?? task.title;
  task.description = description ?? task.description;
  task.status = status ?? task.status;
  task.dueDate = dueDate ?? task.dueDate;

  const updatedTask = await task.save();

  await updatedTask.populate('user', 'name');

  return res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      dueDate: updatedTask.dueDate,
      user: updatedTask.user.name
    }
  });
});


// Delete Task
export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    user: req.userId
  });

  if (!deletedTask) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});