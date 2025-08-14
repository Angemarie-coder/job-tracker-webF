import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import AddJob from './pages/AddJob';
import EditJob from './pages/EditJob';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function AppRoutes() {
  // Ensure smooth scrolling is enabled
  useEffect(() => {
    // Enable smooth scrolling for the entire app
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add touch scrolling support for mobile devices
    if ('ontouchstart' in window) {
      document.body.style.webkitOverflowScrolling = 'touch';
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Navbar />
        <main className="container mx-auto px-4 py-8 overflow-x-hidden smooth-scroll">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/registration-success" element={
              <PublicRoute>
                <RegistrationSuccess />
              </PublicRoute>
            } />
            <Route path="/verify-email" element={
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <JobList />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id" element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id/edit" element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            } />
            <Route path="/add-job" element={
              <ProtectedRoute>
                <AddJob />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <AppRoutes />
      </JobProvider>
    </AuthProvider>
  );
}

export default App;
