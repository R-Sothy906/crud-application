
// src/api/api.js
import axios from 'axios';

export const config = {
  base_url: import.meta.env.VITE_CONNECT || "http://localhost:3000/api",
  version: "1.0",
  timeout: 10000, // 10 seconds timeout
};

console.log('🔧 Backend URL:', config.base_url);

// Create axios instance
const api = axios.create({
  baseURL: config.base_url,
  withCredentials: true, // Important for cookies
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add token if needed)
api.interceptors.request.use(
  (config) => {
    // If you need to add token to header (though you're using cookies)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (handle token expiry)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        await api.post('/auth/v1/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login on refresh failure
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;