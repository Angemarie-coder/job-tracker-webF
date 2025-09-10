import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { jobs, getStats, loading } = useJobs();
  const { user } = useAuth();
  
  // Use useMemo to prevent unnecessary recalculations
  const stats = useMemo(() => getStats(), [getStats]);

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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
      applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'in progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      interviewing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      interviewed: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'waiting response': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      exam: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      examined: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      offered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      withdrawn: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: '📝',
      'in progress': '⚡',
      interviewing: '🤝',
      interviewed: '✅',
      'waiting response': '⏳',
      exam: '📝',
      examined: '📊',
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your job search progress</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.applied}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats['in progress']}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviewing</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviewing}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Interviewed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.interviewed}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Waiting Response</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats['waiting response']}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exam</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.exam}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Examined</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.examined}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.offered}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Jobs</h2>
          <Link to="/jobs" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
            View All
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start tracking your job applications</p>
            <Link to="/add-job" className="btn-primary">
              Add Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4 job-list-container">
            {recentJobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{getStatusIcon(job.status)}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
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
                     className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add New Job</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Track a new job application</p>
          <Link to="/add-job" className="btn-primary w-full">
            Add Job
          </Link>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">View All Jobs</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">See your complete job list</p>
          <Link to="/jobs" className="btn-primary w-full">
            View Jobs
          </Link>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Track your progress</p>
          <Link to="/analytics" className="btn-primary w-full">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
