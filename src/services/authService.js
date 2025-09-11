import api from './api';

export const authService = {
  // User registration
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    // Only store token if no verification is required
    if (response.data.data?.token) {
      localStorage.setItem('jobTrackerToken', response.data.data.token);
      localStorage.setItem('jobTrackerUser', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // User login
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    console.log('🔍 AuthService login response:', response.data);
    if (response.data.data?.token) {
      localStorage.setItem('jobTrackerToken', response.data.data.token);
      localStorage.setItem('jobTrackerUser', JSON.stringify(response.data.data.user));
      console.log('🔍 Stored token:', response.data.data.token);
      console.log('🔍 Stored user:', response.data.data.user);
    }
    return response.data;
  },

  // Verify email with token
  async verifyEmail(token) {
    const response = await api.get(`/auth/verify-email`, { params: { token } });
    return response.data;
  },

  // Resend verification email
  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    // Update stored user data
    const currentUser = JSON.parse(localStorage.getItem('jobTrackerUser') || '{}');
    const updatedUser = { ...currentUser, ...response.data.user };
    localStorage.setItem('jobTrackerUser', JSON.stringify(updatedUser));
    return response.data;
  },

  // Change password
  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('jobTrackerToken');
    localStorage.removeItem('jobTrackerUser');
    // Call logout endpoint if needed
    api.post('/auth/logout').catch(() => {
      // Ignore errors on logout
    });
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('jobTrackerToken');
  },

  // Get current user from localStorage
  getCurrentUser() {
    const user = localStorage.getItem('jobTrackerUser');
    return user ? JSON.parse(user) : null;
  },

  // Get auth token
  getToken() {
    return localStorage.getItem('jobTrackerToken');
  }
};
