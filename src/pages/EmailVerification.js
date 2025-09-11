import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

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
      const data = await authService.verifyEmail(token);
      if (data.success) {
        setVerificationStatus('success');
        setMessage(data.message);
      } else {
        setVerificationStatus('error');
        setMessage(data.message || 'Verification failed');
      }
    } catch (error) {
      setVerificationStatus('error');
      setMessage(error.userMessage || 'The verification link may have expired or is invalid. Please request a new verification email.');
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
              <Link to="/login" className="btn-primary inline-block w-full text-center">Go to Login</Link>
            </div>
          </div>
        );

      case 'error':
      default:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Verification Failed
            </h2>

            <p className="text-gray-600">
              {message || 'The verification link may have expired or is invalid. Please request a new verification email.'}
            </p>

            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm text-red-700">
                    You can request a new verification email from the registration success page or try logging in to trigger a resend option.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/register" className="btn-secondary inline-block w-full text-center">Back to Register</Link>
              <Link to="/login" className="btn-primary inline-block w-full text-center">Go to Login</Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;
