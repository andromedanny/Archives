import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Login form submitted:', { email: formData.email });
    const result = await login(formData);
    console.log('Login result:', result);
    
    if (result.success) {
      // Wait longer for state to update and context to initialize
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Double-check token is stored
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        console.error('Token or user not stored after login');
        setError('Failed to store authentication. Please try again.');
        return;
      }
      
      try {
        const user = result.user || JSON.parse(storedUser);
        console.log('Redirecting user:', user);
        
        // Redirect based on user role
        if (user?.role === 'admin') {
          console.log('Navigating to /admin');
          navigate('/admin', { replace: true });
        } else {
          console.log('Navigating to /dashboard');
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        setError('Failed to parse user data. Please try again.');
      }
    } else {
      console.error('Login failed:', result.error);
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - One Faith One Archive</title>
        <meta name="description" content="Sign in to access the One Faith One Archive" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto space-y-6"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/faith logo.png" 
            alt="FAITH Colleges Logo" 
            className="h-12 w-auto mx-auto"
          />
          <p className="text-gray-600 mt-4">Sign in to your account</p>
        </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                School ID
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your School ID"
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
    </>
  );
};

export default Login;