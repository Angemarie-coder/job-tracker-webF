import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';

const RegistrationSuccess = () => {
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);
  
  const userEmail = location.state?.email || 'your email';

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendStatus(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResendStatus({ type: 'success', message: data.message });
      } else {
        setResendStatus({ type: 'error', message: data.message || 'Failed to resend verification email' });
      }
    } catch (error) {
      setResendStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to
          </p>
          
          <p className="mt-1 text-lg font-medium text-primary-600">
            {userEmail}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-200">
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900">
              Verify Your Email Address
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Click the verification link in your email to activate your account and start tracking your job applications.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Important:</strong> The verification link will expire in 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Resending...</span>
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                <span>Resend Verification Email</span>
              </>
            )}
          </button>

          {resendStatus && (
            <div className={`rounded-md p-4 ${
              resendStatus.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {resendStatus.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    resendStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {resendStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already verified?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="text-primary-600 hover:text-primary-500 underline"
            >
              request a new verification email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationSuccess;
