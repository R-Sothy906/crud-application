// taskApi.js
import { api } from './axios.js';

// Get all tasks
export const getTasks = async (params = {}) => {
  const response = await api.get('/api/tasks', {
    params
  });

  return response.data;
};

// Get task by ID
export const getTaskById = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);

  return response.data;
};

// Create task
export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);

  return response.data;
};

// Update task
export const updateTask = async (id, taskData) => {
  const response = await api.put(
    `/api/tasks/${id}`,
    taskData
  );

  return response.data;
};

// Delete task
export const deleteTask = async (id) => {
  const response = await api.delete(
    `/api/tasks/${id}`
  );

  return response.data;
};