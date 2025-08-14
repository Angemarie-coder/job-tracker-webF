import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobTrackerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    // Handle 429 (Too Many Requests) - show user-friendly message
    if (response?.status === 429) {
      console.warn('⚠️ Rate limited (429). Please wait before making more requests.');
      error.userMessage = 'Too many requests. Please wait a moment and try again.';
    }
    
    // Handle 401 (Unauthorized)
    if (response?.status === 401) {
      localStorage.removeItem('jobTrackerToken');
      localStorage.removeItem('jobTrackerUser');
      window.location.href = '/login';
    }
    
    // Handle 503 (Service Unavailable)
    if (response?.status === 503) {
      error.userMessage = 'Service temporarily unavailable. Please try again later.';
    }
    
    // Handle network errors
    if (!response) {
      error.userMessage = 'Network error. Please check your connection and try again.';
    }
    
    return Promise.reject(error);
  }
);

export default api;
