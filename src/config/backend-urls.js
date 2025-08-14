// Backend URL Configuration
// Update these URLs when you deploy to different services

export const BACKEND_URLS = {
  // Development (local)
  development: 'http://localhost:5000/api',
  
  // Production (Render)
  production: 'https://job-tracker-webb.onrender.com/api',
  
  // Staging (if you have a staging environment)
  staging: 'https://your-staging-backend-url.onrender.com/api',
  
  // Custom domain (if you have one)
  custom: 'https://your-custom-domain.com/api'
};

// Add your actual Render backend URL here
export const RENDER_BACKEND_URL = 'https://job-tracker-webb.onrender.com/api';

// Add your actual local backend URL here (if different from default)
export const LOCAL_BACKEND_URL = 'http://localhost:5000/api';

export default BACKEND_URLS;
