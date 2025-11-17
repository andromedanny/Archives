import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    course: '',
    role: 'student'
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  // Fetch departments and courses
  useEffect(() => {
    const fetchRegisterData = async () => {
      try {
        setIsLoadingData(true);
        setError(''); // Clear any previous errors
        const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api';
        const response = await axios.get(`${apiUrl}/auth/register-data`);
        if (response.data.success) {
          setDepartments(response.data.data || []);
          if (!response.data.data || response.data.data.length === 0) {
            setError('No departments available. Please contact administrator.');
          }
        } else {
          setError('Failed to load departments. Please refresh the page.');
        }
      } catch (error) {
        console.error('Error fetching departments and courses:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load departments';
        setError(`Error: ${errorMessage}. Please ensure the backend server is running.`);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchRegisterData();
  }, []);

  // Update courses when department changes
  useEffect(() => {
    if (formData.department) {
      const selectedDept = departments.find(d => d.name === formData.department);
      if (selectedDept) {
        setCourses(selectedDept.courses || []);
      } else {
        setCourses([]);
      }
      setFormData(prev => ({ ...prev, course: '' }));
    } else {
      setCourses([]);
    }
  }, [formData.department, departments]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      course: formData.course,
      role: formData.role
    });

    if (result.success) {
      if (result.needsApproval) {
        // Show success message and redirect to login
        setError(''); // Clear any errors
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        // Admin user - redirect immediately
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Create an account to access the FAITH Colleges Thesis Archive" />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto space-y-6"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src="/faith logo.png" 
            alt="FAITH Colleges Logo" 
            className="h-12 w-auto mx-auto"
          />
          <p className="text-gray-600 mt-4">Create your account</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

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
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              disabled={isLoadingData}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">{isLoadingData ? 'Loading departments...' : 'Select Department'}</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
              disabled={!formData.department || courses.length === 0}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.department 
                  ? 'Select Department first' 
                  : courses.length === 0 
                  ? 'No courses available' 
                  : 'Select Course'}
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.code}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
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
              placeholder="Enter your password (min. 6 characters)"
              required
              minLength={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Register;