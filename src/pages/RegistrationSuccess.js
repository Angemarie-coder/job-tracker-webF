import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

const RegistrationSuccess = () => {
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState(null);

  const userEmail = location.state?.email || 'your email';

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendStatus(null);

    try {
      const data = await authService.resendVerification(userEmail);
      if (data.success) {
        setResendStatus({ type: 'success', message: data.message });
      } else {
        setResendStatus({ type: 'error', message: data.message || 'Failed to resend verification email' });
      }
    } catch (error) {
      setResendStatus({ type: 'error', message: error.userMessage || 'Network error. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Registration Successful!</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We sent a verification link to{' '}
            <span className="font-medium text-gray-900 dark:text-white">{userEmail}</span>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Verify Your Email Address
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">
              Click the verification link in your email to activate your account and start tracking your job applications.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 dark:bg-blue-950/40 dark:border-blue-900">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
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
            className="btn-primary inline-flex items-center justify-center w-full"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? 'Resending...' : 'Resend Verification Email'}
          </button>

          {resendStatus && (
            <div
              className={`rounded-md p-3 text-sm ${
                resendStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {resendStatus.message}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already verified?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign in to your account
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
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
