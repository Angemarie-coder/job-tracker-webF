import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { jobs, getStats, loading } = useJobs();
  const { user } = useAuth();
  const stats = getStats();

  // Helper function to safely format dates
  const safeFormatDate = (dateValue, options = { addSuffix: true }) => {
    if (!dateValue) return 'Unknown date';
    
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return formatDistanceToNow(date, options);
    } catch (error) {
      console.warn('Error formatting date:', dateValue, error);
      return 'Invalid date';
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Ensure jobs is an array before processing
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const recentJobs = safeJobs
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 5);

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      interviewing: 'bg-yellow-100 text-yellow-800',
      offered: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: '📝',
      interviewing: '🤝',
      offered: '🎉',
      rejected: '❌',
      withdrawn: '↩️'
    };
    return icons[status] || '📋';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Track your job search progress</p>
        </div>
        <Link
          to="/add-job"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Job</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Applied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Interviewing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.interviewing}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.offered}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
            <p className="text-gray-600 mb-4">Start tracking your job applications</p>
            <Link to="/add-job" className="btn-primary">
              Add Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4 job-list-container">
            {recentJobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getStatusIcon(job.status)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.company}
                      </span>
                                             <span className="flex items-center">
                         <Calendar className="h-4 w-4 mr-1" />
                         {safeFormatDate(job.updatedAt)}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`status-badge ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                                     <Link
                     to={`/jobs/${job._id}`}
                     className="text-primary-600 hover:text-primary-700 font-medium"
                   >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="p-3 bg-primary-100 rounded-lg w-fit mx-auto mb-4">
            <Plus className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Job</h3>
          <p className="text-gray-600 mb-4">Track a new job application</p>
          <Link to="/add-job" className="btn-primary w-full">
            Add Job
          </Link>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View All Jobs</h3>
          <p className="text-gray-600 mb-4">See your complete job list</p>
          <Link to="/jobs" className="btn-primary w-full">
            View Jobs
          </Link>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-gray-600 mb-4">Track your progress</p>
          <Link to="/analytics" className="btn-primary w-full">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
