import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const user = authService.getCurrentUser();
        
        if (token && user) {
          // Verify token is still valid by getting profile
          const profile = await authService.getProfile();
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: profile.user, token }
          });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: null });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const data = await authService.login(credentials);
      console.log('🔍 Login response data:', data);
      console.log('🔍 User data:', data.data?.user);
      console.log('🔍 Token:', data.data?.token);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: data.data.user, token: data.data.token }
      });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const data = await authService.register(userData);
      
      // Only set authentication if no verification is required
      if (data.data?.requiresVerification) {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
        return data;
      } else {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: data.data.user, token: data.data.token }
        });
        return data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      dispatch({ type: 'UPDATE_USER', payload: data.user });
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
