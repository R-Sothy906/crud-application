// controllers/taskController.js

import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter task title' 
      });
    }

    const existingTask = await Task.findOne({ title: title });
    
    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: 'This task already exists, please use a different title'
      });
    }

    const newTask = new Task({
      title,
      description,
      status: status || 'pending',
      dueDate
    });

    const savedTask = await newTask.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: savedTask
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    });
  }
};

// Get all tasks
export const getAllTask = async (req, res) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error.message
    });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        title,
        description,
        status,
        dueDate,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    console.error('Error updating task:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: error.message
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: error.message
    });
  }
};

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
      error: error.message
    });
  }
};