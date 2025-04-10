// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
});

// Add an interceptor to attach the JWT token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Add a response interceptor to handle 401 unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is due to an unauthorized request (401)
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);

export default api;
