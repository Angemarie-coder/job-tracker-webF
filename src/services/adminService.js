import api from './api';

export const adminService = {
  // Get all users
  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get single user
  getUser: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Get system statistics
  getSystemStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};
