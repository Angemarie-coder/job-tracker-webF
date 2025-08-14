import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, DollarSign, Briefcase, Globe, User, Phone, Mail } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { formatDistanceToNow } from 'date-fns';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, deleteJob, loading } = useJobs();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = getJobById(id);
      if (jobData) {
        setJob(jobData);
      } else {
        // If job not found in context, try to refresh jobs
        // This handles cases where user navigates directly to URL
        navigate('/jobs');
      }
    };

    fetchJob();
  }, [id, getJobById, navigate]);

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

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        navigate('/jobs');
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link to="/jobs" className="btn-primary">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/jobs" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-2">{job.company}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link
            to={`/jobs/${id}/edit`}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Link>
          
          <button
            onClick={handleDeleteJob}
            className="btn-danger flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-3">
        <span className="text-3xl">{getStatusIcon(job.status)}</span>
        <span className={`status-badge ${getStatusColor(job.status)}`}>
          {job.status}
        </span>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Position</p>
                  <p className="text-gray-900">{job.title}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{job.location || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Applied</p>
                  <p className="text-gray-900">{safeFormatDate(job.applicationDate)}</p>
                </div>
              </div>
              
              {job.salary && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Salary</p>
                    <p className="text-gray-900">{job.salary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {job.description && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Company Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company</h2>
            <div className="space-y-3">
              <p className="text-gray-900 font-medium">{job.company}</p>
              
              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Globe className="h-4 w-4" />
                  <span>View Job Posting</span>
                </a>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(job.contactPerson || job.contactEmail || job.contactPhone) && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                {job.contactPerson && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700">{job.contactPerson}</span>
                  </div>
                )}
                
                {job.contactEmail && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {job.contactEmail}
                    </a>
                  </div>
                )}
                
                {job.contactPhone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a
                      href={`tel:${job.contactPhone}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {job.contactPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Priority */}
          {job.priority && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.priority === 'high' ? 'bg-red-100 text-red-800' :
                job.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
