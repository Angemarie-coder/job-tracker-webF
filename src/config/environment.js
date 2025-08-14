import { RENDER_BACKEND_URL, LOCAL_BACKEND_URL } from './backend-urls';

// Environment configuration that automatically detects local vs production
const getApiUrl = () => {
  // Check if we're running on Vercel (production) - including user's specific domain
  if (window.location.hostname.includes('vercel.app') || 
      window.location.hostname.includes('job-tracker-web-f.vercel.app') ||
      window.location.hostname.includes('job-tracker-web-k1muubq57-angemarie-coders-projects.vercel.app')) {
    // Production: Use Render backend
    return RENDER_BACKEND_URL;
  }
  
  // Check if we're running on localhost (development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Development: Use local backend
    return LOCAL_BACKEND_URL;
  }
  
  // Check if we're running on any other domain (staging, custom domain, etc.)
  if (window.location.hostname.includes('netlify.app') || 
      window.location.hostname.includes('github.io') ||
      window.location.hostname.includes('custom-domain.com')) {
    // Other hosting: Use Render backend
    return RENDER_BACKEND_URL;
  }
  
  // Fallback: Use environment variable if set, otherwise localhost
  return process.env.REACT_APP_API_URL || LOCAL_BACKEND_URL;
};

// Export the configuration
export const config = {
  apiUrl: getApiUrl(),
  environment: window.location.hostname === 'localhost' ? 'development' : 'production',
  isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: window.location.hostname.includes('vercel.app') || 
                window.location.hostname.includes('netlify.app') ||
                window.location.hostname.includes('github.io') ||
                window.location.hostname.includes('job-tracker-web-f.vercel.app')
};

export default config;
