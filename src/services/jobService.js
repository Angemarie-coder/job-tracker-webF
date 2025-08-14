import api from './api';

export const jobService = {
  // Get all jobs with optional filtering, search, and pagination
  async getJobs(params = {}) {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get a single job by ID
  async getJob(id) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create a new job
  async createJob(jobData) {
    console.log('🔍 Creating job with data:', jobData);
    const response = await api.post('/jobs', jobData);
    console.log('🔍 Job creation response:', response.data);
    return response.data;
  },

  // Update an existing job
  async updateJob(id, jobData) {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete a job
  async deleteJob(id) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Update job status
  async updateJobStatus(id, status) {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  // Add an interview to a job
  async addInterview(jobId, interviewData) {
    const response = await api.post(`/jobs/${jobId}/interviews`, interviewData);
    return response.data;
  },

  // Get job statistics
  async getJobStats() {
    const response = await api.get('/analytics/stats');
    return response.data;
  },

  // Get application timeline
  async getApplicationTimeline(period = '30d') {
    const response = await api.get('/analytics/timeline', { params: { period } });
    return response.data;
  },

  // Get company insights
  async getCompanyInsights() {
    const response = await api.get('/analytics/companies');
    return response.data;
  },

  // Get location insights
  async getLocationInsights() {
    const response = await api.get('/analytics/locations');
    return response.data;
  },

  // Get interview performance
  async getInterviewPerformance() {
    const response = await api.get('/analytics/interviews');
    return response.data;
  },

  // Get application trends
  async getApplicationTrends(period = '30d') {
    const response = await api.get('/analytics/trends', { params: { period } });
    return response.data;
  }
};
