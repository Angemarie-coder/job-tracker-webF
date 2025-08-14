import React, { useState, useEffect, useCallback } from 'react';
import { useJobs } from '../context/JobContext';
import { 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Users,
  Target,
  Award,
  Clock
} from 'lucide-react';

const Analytics = () => {
  const { getStats, loading, error } = useJobs();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  
  // Memoize the stats calculation to prevent unnecessary re-renders
  const calculateStats = useCallback(() => {
    if (!loading) {
      try {
        const currentStats = getStats();
        console.log('🔍 Analytics component - stats:', currentStats);
        
        // Ensure we have valid stats
        if (currentStats && typeof currentStats === 'object' && currentStats.total !== undefined) {
          console.log('🔍 Valid stats received, setting state');
          setStats(currentStats);
        } else {
          console.log('🔍 Invalid stats received, setting to null');
          setStats(null);
        }
      } catch (error) {
        console.error('❌ Error getting stats:', error);
        setStats(null);
      }
    }
  }, [getStats, loading]);
  
  // Get stats only once when component mounts or when loading/error changes
  useEffect(() => {
    calculateStats();
  }, [calculateStats, error]); // Now properly includes all dependencies

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // If no stats available, show a message
  if (!stats) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="text-gray-500 text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Available</h3>
          <p className="text-gray-600 mb-4">Please add some jobs to see your analytics</p>
          <p className="text-sm text-gray-500">The data will appear automatically once you have jobs in your tracker.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading analytics</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Search Analytics</h1>
        <p className="text-gray-600">Track your progress and gain insights into your job search</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
            { id: 'companies', label: 'Companies', icon: Briefcase },
            { id: 'locations', label: 'Locations', icon: MapPin },
            { id: 'interviews', label: 'Interviews', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 inline mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="p-3 bg-primary-100 rounded-lg w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.total || 0}</h3>
              <p className="text-gray-600">Total Applications</p>
            </div>

            <div className="card text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.interviewing || 0}</h3>
              <p className="text-gray-600">In Progress</p>
            </div>

            <div className="card text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.offered || 0}</h3>
              <p className="text-gray-600">Offers Received</p>
            </div>

            <div className="card text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats?.total > 0 ? Math.round(((stats?.offered || 0) / stats.total) * 100) : 0}%
              </h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
              <div className="space-y-3">
                {[
                  { name: 'Applied', value: stats?.applied || 0, color: 'bg-blue-500' },
                  { name: 'Interviewing', value: stats?.interviewing || 0, color: 'bg-yellow-500' },
                  { name: 'Offered', value: stats?.offered || 0, color: 'bg-green-500' },
                  { name: 'Rejected', value: stats?.rejected || 0, color: 'bg-red-500' },
                  { name: 'Withdrawn', value: stats?.withdrawn || 0, color: 'bg-gray-500' }
                ].filter(item => item.value > 0).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${stats?.total > 0 ? (item.value / stats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700 font-medium">Response Rate</span>
                  <span className="text-blue-900 font-bold">
                    {stats?.total > 0 ? Math.round(((stats?.interviewing + stats?.offered) / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Interview Success</span>
                  <span className="text-green-900 font-bold">
                    {stats?.interviewing > 0 ? Math.round((stats?.offered / stats?.interviewing) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700 font-medium">Active Applications</span>
                  <span className="text-purple-900 font-bold">
                    {stats?.applied + stats?.interviewing || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Timeline</h3>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Timeline data will be available soon</p>
          </div>
        </div>
      )}

      {/* Companies Tab */}
      {activeTab === 'companies' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Performance</h3>
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Company data will be available soon</p>
          </div>
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Analysis</h3>
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Location data will be available soon</p>
          </div>
        </div>
      )}

      {/* Interviews Tab */}
      {activeTab === 'interviews' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Performance</h3>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Interview data will be available soon</p>
          </div>
        </div>
      )}

      {/* Insights Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Current Status</h4>
                <p className="text-sm text-gray-600">
                  You have {stats?.total || 0} total applications with {stats?.interviewing || 0} currently in progress.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Success Rate</h4>
                <p className="text-sm text-gray-600">
                  Your overall success rate is {stats?.total > 0 ? Math.round(((stats?.offered || 0) / stats.total) * 100) : 0}%.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Application Volume</h4>
                <p className="text-sm text-gray-600">
                  Keep up the momentum with consistent applications.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Next Steps</h4>
                <p className="text-sm text-gray-600">
                  Focus on following up with applications and preparing for interviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
