import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useJobs } from '../context/JobContext';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getJobById, updateJob } = useJobs();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    status: 'applied',
    salary: '',
    description: '',
    applicationDate: '',
    jobUrl: '',
    notes: ''
  });

  // Load existing job data
  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const job = getJobById(id);
        
        if (!job) {
          setError('Job not found');
          return;
        }

        // Pre-populate form with existing job data
        setFormData({
          title: job.title || '',
          company: job.company || '',
          location: job.location || '',
          status: job.status || 'applied',
          salary: job.salary || '',
          description: job.description || '',
          applicationDate: job.applicationDate ? new Date(job.applicationDate).toISOString().split('T')[0] : '',
          jobUrl: job.jobUrl || '',
          notes: job.notes || ''
        });
      } catch (error) {
        console.error('Error loading job:', error);
        setError('Failed to load job data');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, getJobById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a job title');
      return;
    }
    
    if (!formData.company.trim()) {
      alert('Please enter a company name');
      return;
    }
    
    if (!formData.applicationDate) {
      alert('Please select an application date');
      return;
    }
    
    try {
      setSaving(true);
      
      // Convert date string to Date object for backend and filter out empty optional fields
      const jobDataToSend = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        status: formData.status,
        applicationDate: new Date(formData.applicationDate).toISOString()
      };
      
      // Only add non-empty optional fields
      if (formData.location.trim()) jobDataToSend.location = formData.location.trim();
      if (formData.salary.trim()) jobDataToSend.salary = formData.salary.trim();
      if (formData.description.trim()) jobDataToSend.description = formData.description.trim();
      if (formData.jobUrl.trim()) jobDataToSend.jobUrl = formData.jobUrl.trim();
      if (formData.notes.trim()) jobDataToSend.notes = formData.notes.trim();
      
      console.log('🔍 Updating job with data:', jobDataToSend);
      console.log('🔍 Job ID being updated:', id);
      
      const result = await updateJob(id, jobDataToSend);
      console.log('🔍 Update result:', result);
      
      // Navigate back to the job detail page
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading job</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
          <p className="text-gray-600 mt-2">Update your job application details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Google"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Date *
              </label>
              <input
                type="date"
                name="applicationDate"
                value={formData.applicationDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input-field"
              placeholder="Brief description of the role..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Posting URL
            </label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input-field"
              placeholder="Any additional notes or thoughts..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={saving}
          >
            {saving ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{saving ? 'Updating...' : 'Update Job'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
