import {api} from './axios.js';

// Register 
export const registerUser = async(userData) => {
    const response = await api.post('/api/register', userData);
    return response.data;
}
  
// Login 
export const loginUser = async(userData) => {
    const response = await api.post('/api/login', userData);
    return response.data;
}

// Logout
export const logoutUser = async () => {
    const response = await api.post('/api/logout');
    return response.data;
};
 
// Profile
export const getMe = async()=> {
    const response = await api.get('/api/me');
    return response.data;
}