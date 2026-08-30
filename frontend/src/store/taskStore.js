import { create } from 'zustand';

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../api/taskApi.js';

const useTaskStore = create((set) => ({

  // State
  tasks: [],
  task: null,
  loading: false,
  error: null,

  // Get All Tasks
  fetchTasks: async (params = {}) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await getTasks(params);

      set({
        tasks: data.data,
        loading: false,
        error: null
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to fetch tasks';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Get Task By ID
  fetchTaskById: async (id) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await getTaskById(id);

      set({
        task: data.data,
        loading: false,
        error: null
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to fetch task';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Create Task
  addTask: async (taskData) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await createTask(taskData);

      set((state) => ({
        tasks: [data.data, ...state.tasks],
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to create task';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Update Task
  editTask: async (id, taskData) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await updateTask(id, taskData);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === id ? data.data : task
        ),
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to update task';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Delete Task
  removeTask: async (id) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await deleteTask(id);

      set((state) => ({
        tasks: state.tasks.filter(
          (task) => task._id !== id
        ),
        loading: false,
        error: null
      }));

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Failed to delete task';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Clear Error
  clearError: () => {
    set({
      error: null
    });
  },

  // Clear Current Task
  clearTask: () => {
    set({
      task: null
    });
  }

}));

export default useTaskStore;