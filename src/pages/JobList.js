import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Edit, Trash2, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { formatDistanceToNow } from 'date-fns';

const JobList = () => {
  const { jobs, deleteJob, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');

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

  // Ensure jobs is an array before processing - wrapped in useMemo to prevent dependency changes
  const safeJobs = useMemo(() => {
    return Array.isArray(jobs) ? jobs : [];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    // Use safeJobs instead of jobs
    let filtered = [...safeJobs]; // Create a copy to avoid mutating original

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'updatedAt') {
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (sortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      } else if (sortBy === 'applicationDate') {
        return new Date(b.applicationDate || 0) - new Date(a.applicationDate || 0);
      }
      return 0;
    });

    return filtered;
  }, [safeJobs, searchTerm, statusFilter, sortBy]);

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

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(jobId);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  console.log('🔍 JobList - jobs:', jobs, 'safeJobs:', safeJobs);
  console.log('🔍 JobList - jobs type:', typeof jobs, 'isArray:', Array.isArray(jobs));
  console.log('🔍 JobList - jobs length:', jobs ? jobs.length : 'undefined');
  
  // Debug date values
  if (safeJobs.length > 0) {
    console.log('🔍 Sample job dates:', safeJobs[0]);
    console.log('🔍 applicationDate:', safeJobs[0].applicationDate);
    console.log('🔍 updatedAt:', safeJobs[0].updatedAt);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>
          <p className="text-gray-600 mt-2">Manage your job applications</p>
        </div>
        <Link
          to="/add-job"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Job</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
            >
              <option value="updatedAt">Sort by Recent</option>
              <option value="title">Sort by Title</option>
              <option value="company">Sort by Company</option>
              <option value="applicationDate">Sort by Application Date</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            {filteredJobs.length} of {safeJobs.length} jobs
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {safeJobs.length === 0 ? 'No jobs yet' : 'No jobs match your filters'}
          </h3>
          <p className="text-gray-600 mb-4">
            {safeJobs.length === 0 
              ? 'Start tracking your job applications' 
              : 'Try adjusting your search or filters'
            }
          </p>
          {safeJobs.length === 0 && (
            <Link to="/add-job" className="btn-primary">
              Add Your First Job
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4 job-list-container">
          {filteredJobs.map((job) => (
            <div key={job._id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">{getStatusIcon(job.status)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.company}</span>
                      </div>
                      {job.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Applied {safeFormatDate(job.applicationDate)}</span>
                      </div>
                    </div>
                    
                    {job.salary && (
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                  
                  <Link
                    to={`/jobs/${job._id}/edit`}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                    title="Edit Job"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    title="Delete Job"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
