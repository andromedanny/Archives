import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import BackgroundImage from '../../components/UI/BackgroundImage';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        navigate('/');
      } else {
        throw new Error(data.message || 'Login failed');
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
        <title>Login - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Sign in to access the FAITH Colleges Thesis Archive" />
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
              FAITH Colleges Thesis Archive
            </h1>
            <p className="text-gray-600">Sign in to access the archive</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Register here
              </Link>
            </p>
            <p>
              <Link to="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Forgot your password?
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;