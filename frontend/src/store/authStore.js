import { create } from 'zustand';

import {
  registerUser,
  loginUser,
  logoutUser,
  getMe
} from '../api/authApi.js';

const useAuthStore = create((set) => ({

  // State
  user: null,
  isAuthenticated: false,
  checkingAuth: true,
  loading: false,
  error: null,

  // Register
  register: async (userData) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await registerUser(userData);

      set({
        user: data.data,
        isAuthenticated: true,
        loading: false,
        error: null
      });

      return data;

    } catch (error) {

      const message =
        error.response?.data?.message ||
        'Registration failed';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Login
  login: async (userData) => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await loginUser(userData);

      set({
        user: data.data,
        isAuthenticated: true,
        loading: false,
        error: null
      });

      return data;

    } catch (error) {

      const message =
        error.response?.data?.message ||
        'Login failed';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({
      loading: true,
      error: null
    });

    try {
      const data = await logoutUser();

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });

      return data;

    } catch (error) {

      const message =
        error.response?.data?.message ||
        'Logout failed';

      set({
        loading: false,
        error: message
      });

      throw error;
    }
  },

  // Get current user
getCurrentUser: async () => {

  console.log('Calling /api/me...');

  try {

    const data = await getMe();

    console.log('Current user:', data);

    set({
      user: data.data,
      isAuthenticated: true,
      checkingAuth: false,
      error: null
    });

  } catch (error) {

    console.log('GET /api/me ERROR:', error);
    console.log('Response:', error.response?.data);

    set({
      user: null,
      isAuthenticated: false,
      checkingAuth: false,
      error: null
    });
  }
},

  // Clear error
  clearError: () => {
    set({
      error: null
    });
  }

}));

export default useAuthStore;