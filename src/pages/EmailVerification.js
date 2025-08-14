import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  useEffect(() => {
    if (verificationStatus === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (verificationStatus === 'success' && countdown === 0) {
      navigate('/login');
    }
  }, [verificationStatus, countdown, navigate]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/verify-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVerificationStatus('success');
        setMessage(data.message);
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Verifying Your Email
            </h2>
            
            <p className="text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Email Verified Successfully!
            </h2>
            
            <p className="text-gray-600">
              {message}
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Redirecting to login page in <span className="font-bold">{countdown}</span> seconds...
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/login"
                className="btn-primary w-full flex justify-center py-3 px-4"
              >
                Go to Login Now
              </Link>
              
              <p className="text-sm text-gray-500">
                Or wait to be redirected automatically
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Verification Failed
            </h2>
            
            <p className="text-gray-600">
              {message}
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    The verification link may have expired or is invalid. Please request a new verification email.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/register"
                className="btn-primary w-full flex justify-center py-3 px-4"
              >
                Create New Account
              </Link>
              
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Back to Login
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;
