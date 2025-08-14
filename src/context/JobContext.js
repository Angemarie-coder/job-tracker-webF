import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { jobService } from '../services/jobService';
import { useAuth } from './AuthContext';

const JobContext = createContext();

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  stats: null
};

const jobReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'ADD_JOB':
      // Ensure state.jobs is an array before spreading
      const currentJobs = Array.isArray(state.jobs) ? state.jobs : [];
      return { ...state, jobs: [...currentJobs, action.payload] };
    case 'UPDATE_JOB':
      // Ensure state.jobs is an array before mapping
      const jobsToUpdate = Array.isArray(state.jobs) ? state.jobs : [];
      return {
        ...state,
        jobs: jobsToUpdate.map(job =>
          job._id === action.payload._id ? action.payload : job
        )
      };
    case 'DELETE_JOB':
      // Ensure state.jobs is an array before filtering
      const jobsToFilter = Array.isArray(state.jobs) ? state.jobs : [];
      return {
        ...state,
        jobs: jobsToFilter.filter(job => job._id !== action.payload)
      };
    case 'SET_STATS':
      console.log('🔍 SET_STATS reducer called with payload:', action.payload);
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  const [isInitialFetchComplete, setIsInitialFetchComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  // Load jobs from API only when authenticated
  useEffect(() => {
    console.log('🔍 JobContext useEffect triggered - auth loading:', authLoading, 'authenticated:', isAuthenticated, 'initial fetch complete:', isInitialFetchComplete);
    
    // Don't fetch jobs if still checking authentication or not authenticated
    if (authLoading || !isAuthenticated) {
      console.log('🔍 Skipping job fetch - auth loading:', authLoading, 'authenticated:', isAuthenticated);
      return;
    }

    // Don't fetch if we've already completed the initial fetch
    if (isInitialFetchComplete) {
      console.log('🔍 Initial fetch already completed, skipping...');
      return;
    }

    // Add a small delay to ensure auth is fully settled
    const timer = setTimeout(() => {
      console.log('🔍 Starting delayed job fetch...');
      
      // Check if already fetching
      if (isFetching) {
        console.log('🔍 Already fetching, skipping...');
        return;
      }
      
      const fetchJobs = async () => {
        try {
          console.log('🔍 Initial fetch of jobs and stats...');
          setIsFetching(true);
          dispatch({ type: 'SET_LOADING', payload: true });
          
          const data = await jobService.getJobs();
          console.log('🔍 Jobs data received:', data);
          console.log('🔍 Jobs array:', data.data?.jobs);
          console.log('🔍 Jobs data structure:', JSON.stringify(data, null, 2));
          dispatch({ type: 'SET_JOBS', payload: data.data?.jobs || [] });
          
          // Also fetch stats
          const statsData = await jobService.getJobStats();
          console.log('🔍 Stats data received:', statsData);
          console.log('🔍 Stats data structure:', JSON.stringify(statsData, null, 2));
          dispatch({ type: 'SET_STATS', payload: statsData });
          
          console.log('🔍 Initial fetch completed');
          setIsInitialFetchComplete(true);
        } catch (error) {
          console.error('❌ Error loading jobs:', error);
          
          // Handle 401 errors gracefully - don't set error state that might trigger retries
          if (error.response?.status === 401) {
            console.warn('⚠️ Unauthorized - user may need to re-authenticate');
            // Don't set error state for auth issues to prevent infinite loops
            dispatch({ type: 'SET_JOBS', payload: [] });
            dispatch({ type: 'SET_STATS', payload: null });
            setIsInitialFetchComplete(true); // Mark as complete even on error to prevent retries
          } else {
            // Increment retry count for non-auth errors
            const newRetryCount = retryCount + 1;
            setRetryCount(newRetryCount);
            
            if (newRetryCount >= 3) {
              console.warn('⚠️ Max retries reached, stopping attempts');
              dispatch({ type: 'SET_ERROR', payload: 'Failed to load jobs after multiple attempts. Please refresh the page.' });
              setIsInitialFetchComplete(true);
            } else {
              console.log(`🔍 Retry attempt ${newRetryCount}/3`);
              // Don't mark as complete, allow retry
              return;
            }
          }
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
          setIsFetching(false);
        }
      };

      fetchJobs();
    }, 100); // Small delay to ensure auth state is stable

    return () => {
      console.log('🔍 Cleaning up JobContext useEffect timer');
      clearTimeout(timer);
    };
  }, [isAuthenticated, authLoading, isInitialFetchComplete, isFetching, retryCount]);

  const addJob = async (jobData) => {
    try {
      console.log('🔍 Adding job with data:', jobData);
      console.log('🔍 Current state.jobs:', state.jobs);
      dispatch({ type: 'SET_LOADING', payload: true });
      const newJob = await jobService.createJob(jobData);
      console.log('🔍 New job created:', newJob);
      dispatch({ type: 'ADD_JOB', payload: newJob });
      
      // Don't refresh stats immediately - let the component use local calculation
      // Stats will be updated when the component re-renders
      
      return newJob;
    } catch (error) {
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        const errorMessage = error.userMessage || 'Too many requests. Please wait a moment and try again.';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateJob = async (id, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await jobService.updateJob(id, updates);
      
      // Extract the actual job data from the response
      const updatedJob = response.data?.job;
      
      if (!updatedJob) {
        throw new Error('No job data received from update');
      }
      
      console.log('🔍 Updating job in context:', updatedJob);
      dispatch({ type: 'UPDATE_JOB', payload: updatedJob });
      
      // Don't refresh stats immediately - let the component use local calculation
      
      return updatedJob;
    } catch (error) {
      console.error('❌ Error updating job:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteJob = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await jobService.deleteJob(id);
      dispatch({ type: 'DELETE_JOB', payload: id });
      
      // Don't refresh stats immediately - let the component use local calculation
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getJobById = (id) => {
    return state.jobs.find(job => job._id === id);
  };

  const getJobsByStatus = (status) => {
    return state.jobs.filter(job => job.status === status);
  };

  const getStats = useCallback(() => {
    console.log('🔍 getStats called with state:', { stats: state.stats, jobs: state.jobs });
    console.log('🔍 state.stats:', state.stats);
    console.log('🔍 state.jobs:', state.jobs);
    
    // If we have stats from the API, use those
    if (state.stats && state.stats.data && state.stats.data.stats) {
      console.log('🔍 Using API stats:', state.stats.data.stats);
      return state.stats.data.stats;
    }
    
    // Fallback to calculating from jobs array (with safety checks)
    if (!state.jobs || !Array.isArray(state.jobs)) {
      console.log('🔍 No jobs array, returning default stats');
      return {
        total: 0,
        applied: 0,
        interviewing: 0,
        offered: 0,
        rejected: 0,
        withdrawn: 0
      };
    }
    
    const calculatedStats = {
      total: state.jobs.length,
      applied: state.jobs.filter(job => job.status === 'applied').length,
      interviewing: state.jobs.filter(job => job.status === 'interviewing').length,
      offered: state.jobs.filter(job => job.status === 'offered').length,
      rejected: state.jobs.filter(job => job.status === 'rejected').length,
      withdrawn: state.jobs.filter(job => job.status === 'withdrawn').length
    };
    
    console.log('🔍 Calculated stats from jobs:', calculatedStats);
    return calculatedStats;
  }, [state.stats, state.jobs]);
  
  // Helper function to check if stats are available
  const hasStats = () => {
    return !!(state.stats && state.stats.data && state.stats.data.stats);
  };

  const refreshJobs = async () => {
    // Don't refresh if not authenticated
    if (!isAuthenticated) {
      console.log('🔍 Skipping refresh - user not authenticated');
      return;
    }

    try {
      // Prevent multiple simultaneous refresh calls
      if (state.loading) {
        console.log('🔍 Refresh already in progress, skipping...');
        return;
      }
      
      // Debounce: prevent refreshing more than once every 2 seconds
      const now = Date.now();
      if (now - lastRefreshTime < 2000) {
        console.log('🔍 Refresh called too frequently, skipping...');
        return;
      }
      
      setLastRefreshTime(now);
      console.log('🔍 Refreshing jobs and stats...');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Only fetch jobs, stats will be calculated locally
      const data = await jobService.getJobs();
      console.log('🔍 Jobs data received:', data);
      dispatch({ type: 'SET_JOBS', payload: data.data?.jobs || [] });
      
      // Clear any existing stats to force local calculation
      dispatch({ type: 'SET_STATS', payload: null });
      
      console.log('🔍 Refresh completed');
    } catch (error) {
      console.error('❌ Error refreshing data:', error);
      
      // Handle 401 errors gracefully - don't set error state that might trigger retries
      if (error.response?.status === 401) {
        console.warn('⚠️ Unauthorized during refresh - user may need to re-authenticate');
        // Don't set error state for auth issues to prevent infinite loops
        // Keep existing jobs data
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    ...state,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobsByStatus,
    getStats,
    hasStats,
    refreshJobs,
    resetContext: () => {
      console.log('🔍 Resetting JobContext...');
      setIsInitialFetchComplete(false);
      setRetryCount(0);
      setIsFetching(false);
      dispatch({ type: 'SET_JOBS', payload: [] });
      dispatch({ type: 'SET_STATS', payload: null });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
