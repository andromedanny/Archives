import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import BackgroundImage from '../../components/UI/BackgroundImage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Reset your password for the FAITH Colleges Thesis Archive" />
      </Helmet>
      
      <BackgroundImage />
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/faith logo.png" 
              alt="FAITH Colleges Logo" 
              className="h-24 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-semibold text-blue-900 mb-2">
              Forgot Password
            </h1>
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="text-green-600 text-sm bg-green-50 p-4 rounded-lg mb-6">
                If this email exists, a reset link has been sent.
              </div>
              <Link 
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Forgot Password Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Remembered your password?{' '}
                  <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;
