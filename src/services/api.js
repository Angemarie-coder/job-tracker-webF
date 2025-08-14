import axios from 'axios';
import config from '../config/environment';

// Create axios instance with automatic environment detection
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the current configuration for debugging
console.log('🌐 API Configuration:', {
  environment: config.environment,
  apiUrl: config.apiUrl,
  isLocal: config.isLocal,
  isProduction: config.isProduction
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem('jobTrackerToken');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
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
    
    // Handle 401 (Unauthorized) - don't redirect automatically
    // Let the component handle this gracefully
    if (response?.status === 401) {
      console.warn('⚠️ Unauthorized (401). Token may be expired or invalid.');
      // Don't redirect automatically - let the component decide what to do
      // The component can check if the user is still authenticated and handle accordingly
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
