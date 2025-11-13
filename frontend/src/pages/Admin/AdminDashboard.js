import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalTheses: 0,
    totalUsers: 0,
    totalDepartments: 0,
    recentSubmissions: 0
  });
  const [dashboardData, setDashboardData] = useState({
    recentActivity: [],
    recentTheses: [],
    upcomingEvents: [],
    pendingReviews: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.error('AdminDashboard error:', error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats = {
        totalTheses: 150,
        totalUsers: 45,
        totalDepartments: 3,
        recentSubmissions: 12
      };

      const mockActivity = [
        {
          id: 1,
          type: 'thesis',
          title: 'New thesis submitted: "Machine Learning Applications in Healthcare"',
          date: new Date().toISOString(),
          author: 'John Doe',
          status: 'Under Review'
        },
        {
          id: 2,
          type: 'user',
          title: 'New user registered: Jane Smith',
          date: new Date(Date.now() - 3600000).toISOString(),
          role: 'student',
          status: 'Active'
        },
        {
          id: 3,
          type: 'thesis',
          title: 'Thesis "Web Development Best Practices" status: Published',
          date: new Date(Date.now() - 7200000).toISOString(),
          status: 'Published'
        },
        {
          id: 4,
          type: 'department',
          title: 'New department added: Information Systems',
          date: new Date(Date.now() - 10800000).toISOString(),
          status: 'Active'
        }
      ];

      const mockRecentTheses = [
        {
          id: 1,
          title: 'Machine Learning Applications in Healthcare',
          author: 'John Doe',
          department: 'Computer Science',
          status: 'Under Review',
          submittedAt: new Date().toISOString(),
          adviser: 'Dr. Smith'
        },
        {
          id: 2,
          title: 'Web Development Best Practices',
          author: 'Jane Smith',
          department: 'Information Technology',
          status: 'Published',
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          adviser: 'Dr. Johnson'
        },
        {
          id: 3,
          title: 'Mobile App Development Trends',
          author: 'Bob Wilson',
          department: 'Computer Science',
          status: 'Approved',
          submittedAt: new Date(Date.now() - 172800000).toISOString(),
          adviser: 'Dr. Brown'
        }
      ];

      const mockEvents = [
        {
          id: 1,
          title: 'Thesis Defense - AI Applications',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Room A101',
          type: 'Thesis Defense'
        },
        {
          id: 2,
          title: 'Faculty Meeting',
          date: new Date(Date.now() + 259200000).toISOString(),
          location: 'Conference Room B',
          type: 'Meeting'
        },
        {
          id: 3,
          title: 'Thesis Submission Deadline',
          date: new Date(Date.now() + 604800000).toISOString(),
          location: 'Online',
          type: 'Deadline'
        }
      ];

      const mockPendingReviews = [
        {
          id: 1,
          title: 'IoT-Based Smart Home System',
          author: 'Alice Brown',
          submittedAt: new Date(Date.now() - 3600000).toISOString(),
          department: 'Information Technology'
        },
        {
          id: 2,
          title: 'E-Learning Platform Development',
          author: 'Charlie Davis',
          submittedAt: new Date(Date.now() - 7200000).toISOString(),
          department: 'Computer Science'
        }
      ];
      
      // Fetch real data from API
      const response = await adminAPI.getDashboard();
      const data = response.data;
      
      if (data.success) {
        setStats(data.stats || {
          totalTheses: 0,
          totalUsers: 0,
          totalDepartments: 0,
          recentSubmissions: 0
        });
        setDashboardData({
          recentActivity: data.recentActivity || [],
          recentTheses: data.recentTheses || [],
          upcomingEvents: data.upcomingEvents || [],
          pendingReviews: data.pendingReviews || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Show user-friendly error message
      if (error.response) {
        // Server responded with error status
        console.error('Server error:', error.response.status, error.response.data);
        if (error.response.status === 500) {
          console.error('Server error details:', error.response.data);
        }
      } else if (error.request) {
        // Request was made but no response received - backend might not be running
        console.error('Network error: No response from server.');
        console.error('Please ensure the backend server is running on port 5000.');
        console.error('To start the backend, run: cd backend && npm start');
        // Don't show toast for network errors on initial load to avoid spam
      } else {
        // Something else happened
        console.error('Error:', error.message);
      }
      
      // Set empty data on error
      setStats({
        totalTheses: 0,
        totalUsers: 0,
        totalDepartments: 0,
        recentSubmissions: 0
      });
      setDashboardData({
        recentActivity: [],
        recentTheses: [],
        upcomingEvents: [],
        pendingReviews: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      if (isNaN(date.getTime())) return 'Never';
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } catch (error) {
      return 'Never';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // CRUD Handlers
  const handleEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setShowEditModal(true);
  };

  const handleDelete = (item, type) => {
    setDeleteItem({ ...item, type });
    setShowDeleteModal(true);
  };

  const handleApprove = (item) => {
    // Update item status to approved
    const updatedTheses = dashboardData.recentTheses.map(thesis => 
      thesis.id === item.id ? { ...thesis, status: 'Approved' } : thesis
    );
    setDashboardData(prev => ({ ...prev, recentTheses: updatedTheses }));
  };

  const handleReject = (item) => {
    // Update item status to rejected
    const updatedTheses = dashboardData.recentTheses.map(thesis => 
      thesis.id === item.id ? { ...thesis, status: 'Rejected' } : thesis
    );
    setDashboardData(prev => ({ ...prev, recentTheses: updatedTheses }));
  };

  const confirmDelete = () => {
    if (deleteItem) {
      // Remove item from appropriate list
      if (deleteItem.type === 'thesis') {
        const updatedTheses = dashboardData.recentTheses.filter(thesis => thesis.id !== deleteItem.id);
        setDashboardData(prev => ({ ...prev, recentTheses: updatedTheses }));
      } else if (deleteItem.type === 'activity') {
        const updatedActivity = dashboardData.recentActivity.filter(activity => activity.id !== deleteItem.id);
        setDashboardData(prev => ({ ...prev, recentActivity: updatedActivity }));
      }
    }
    setShowDeleteModal(false);
    setDeleteItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'green';
      case 'Under Review': return 'yellow';
      case 'Approved': return 'blue';
      case 'Rejected': return 'red';
      case 'Draft': return 'gray';
      default: return 'gray';
    }
  };

  const getColorStyles = (color) => {
    const colors = {
      blue: {
        text: '#2563eb',
        bgLight: '#dbeafe',
        bgMedium: '#bfdbfe',
        bgDark: '#93c5fd',
        border: '#bfdbfe'
      },
      green: {
        text: '#16a34a',
        bgLight: '#dcfce7',
        bgMedium: '#bbf7d0',
        bgDark: '#86efac',
        border: '#bbf7d0'
      },
      purple: {
        text: '#9333ea',
        bgLight: '#f3e8ff',
        bgMedium: '#e9d5ff',
        bgDark: '#d8b4fe',
        border: '#e9d5ff'
      },
      orange: {
        text: '#ea580c',
        bgLight: '#ffedd5',
        bgMedium: '#fed7aa',
        bgDark: '#fdba74',
        border: '#fed7aa'
      }
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <>
        <BackgroundImage />
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Administrative dashboard for system management" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20" style={{ position: 'relative', zIndex: 1 }}>
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl shadow-2xl p-8 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                  <img 
                    src="/faith logo.png" 
                    alt="FAITH Colleges Logo" 
                    className="h-16 w-auto"
                  />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, {user?.firstName || 'Admin'}!
                  </h1>
                  <p className="text-lg text-purple-100">Administrative Dashboard</p>
                </div>
              </div>
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-purple-100">Last login: {formatTimeAgo(user?.lastLogin || new Date().toISOString())}</p>
                <p className="text-sm text-purple-100">Department: {user?.department || 'Administration'}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              onClick={() => navigate('/admin/theses')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Theses</p>
                  <p style={{ color: getColorStyles('blue').text }} className="text-3xl font-bold">{stats.totalTheses}</p>
                </div>
                <div 
                  className="p-3 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${getColorStyles('blue').bgLight}, ${getColorStyles('blue').bgMedium})`
                  }}
                >
                  <BookOpenIcon style={{ color: getColorStyles('blue').text }} className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              onClick={() => navigate('/admin/users')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p style={{ color: getColorStyles('green').text }} className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
                <div 
                  className="p-3 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${getColorStyles('green').bgLight}, ${getColorStyles('green').bgMedium})`
                  }}
                >
                  <UserGroupIcon style={{ color: getColorStyles('green').text }} className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              onClick={() => navigate('/admin/departments')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Departments</p>
                  <p style={{ color: getColorStyles('purple').text }} className="text-3xl font-bold">{stats.totalDepartments}</p>
                </div>
                <div 
                  className="p-3 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${getColorStyles('purple').bgLight}, ${getColorStyles('purple').bgMedium})`
                  }}
                >
                  <AcademicCapIcon style={{ color: getColorStyles('purple').text }} className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
              onClick={() => navigate('/admin/theses?filter=recent')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Recent Submissions</p>
                  <p style={{ color: getColorStyles('orange').text }} className="text-3xl font-bold">{stats.recentSubmissions}</p>
                </div>
                <div 
                  className="p-3 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(to bottom right, ${getColorStyles('orange').bgLight}, ${getColorStyles('orange').bgMedium})`
                  }}
                >
                  <ClockIcon style={{ color: getColorStyles('orange').text }} className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full"></div>
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-white transform hover:-translate-y-1"
                    onClick={() => navigate('/admin/theses')}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                        style={{
                          background: `linear-gradient(to bottom right, ${getColorStyles('blue').bgLight}, ${getColorStyles('blue').bgMedium})`
                        }}
                      >
                        <BookOpenIcon style={{ color: getColorStyles('blue').text }} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Manage Theses</h3>
                        <p className="text-sm text-gray-600">Review and manage thesis submissions</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-white transform hover:-translate-y-1"
                    onClick={() => navigate('/admin/users')}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                        style={{
                          background: `linear-gradient(to bottom right, ${getColorStyles('green').bgLight}, ${getColorStyles('green').bgMedium})`
                        }}
                      >
                        <UserGroupIcon style={{ color: getColorStyles('green').text }} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Manage Users</h3>
                        <p className="text-sm text-gray-600">Add, edit, and manage user accounts</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-white transform hover:-translate-y-1"
                    onClick={() => navigate('/admin/analytics')}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                        style={{
                          background: `linear-gradient(to bottom right, ${getColorStyles('purple').bgLight}, ${getColorStyles('purple').bgMedium})`
                        }}
                      >
                        <ChartBarIcon style={{ color: getColorStyles('purple').text }} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Analytics</h3>
                        <p className="text-sm text-gray-600">View system analytics and reports</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-white transform hover:-translate-y-1"
                    onClick={() => navigate('/admin/departments')}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                        style={{
                          background: `linear-gradient(to bottom right, ${getColorStyles('orange').bgLight}, ${getColorStyles('orange').bgMedium})`
                        }}
                      >
                        <AcademicCapIcon style={{ color: getColorStyles('orange').text }} className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Departments</h3>
                        <p className="text-sm text-gray-600">Manage departments and programs</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 hover:to-white transform hover:-translate-y-1"
                    onClick={() => navigate('/thesis')}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                        style={{
                          background: `linear-gradient(to bottom right, #e0e7ff, #c7d2fe)`
                        }}
                      >
                        <BookOpenIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Thesis Archive</h3>
                        <p className="text-sm text-gray-600">Browse public thesis archive</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-blue-50 to-white hover:from-blue-100 hover:to-white transform hover:-translate-y-1"
                    onClick={() => navigate('/admin/departments?action=create')}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6 bg-blue-100"
                      >
                        <PlusIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Add Departments</h3>
                        <p className="text-sm text-gray-600">Create new departments</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {dashboardData.recentActivity && dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className={`p-1 rounded-full bg-${activity.type === 'thesis' ? 'blue' : activity.type === 'user' ? 'green' : 'purple'}-100`}>
                        <DocumentTextIcon className={`h-4 w-4 text-${activity.type === 'thesis' ? 'blue' : activity.type === 'user' ? 'green' : 'purple'}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.date)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(activity, 'activity')}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                  {(!dashboardData.recentActivity || dashboardData.recentActivity.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recent Theses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                    Recent Theses
                  </h2>
                  <button
                    onClick={() => navigate('/admin/theses')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {dashboardData.recentTheses && dashboardData.recentTheses.slice(0, 5).map((thesis, index) => (
                    <motion.div
                      key={thesis.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                      className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/admin/theses/${thesis.id}`)}
                    >
                      <p className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{thesis.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(thesis.status)}-100 text-${getStatusColor(thesis.status)}-800`}>
                          {thesis.status}
                        </span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(thesis.submittedAt)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">by {thesis.author}</p>
                    </motion.div>
                  ))}
                  {(!dashboardData.recentTheses || dashboardData.recentTheses.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No recent theses</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Events and Pending Reviews - Separate row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-orange-600 to-orange-400 rounded-full"></div>
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  {dashboardData.upcomingEvents && dashboardData.upcomingEvents.slice(0, 3).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-1 rounded-full bg-purple-100">
                        <CalendarIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{event.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.date)} - {event.location}</p>
                      </div>
                    </motion.div>
                  ))}
                  {(!dashboardData.upcomingEvents || dashboardData.upcomingEvents.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No upcoming events</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Pending Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-red-600 to-red-400 rounded-full"></div>
                  Pending Reviews
                </h2>
                <div className="space-y-3">
                  {dashboardData.pendingReviews && dashboardData.pendingReviews.slice(0, 3).map((thesis, index) => (
                    <motion.div
                      key={thesis.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-1 rounded-full bg-red-100">
                        <DocumentTextIcon className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{thesis.title}</p>
                        <p className="text-xs text-gray-500">
                          {thesis.author} - {formatTimeAgo(thesis.submittedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/theses/${thesis.id}/review`)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                      >
                        Review
                      </button>
                    </motion.div>
                  ))}
                  {(!dashboardData.pendingReviews || dashboardData.pendingReviews.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No pending reviews</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  Edit {editingItem.type === 'thesis' ? 'Thesis' : 'Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {editingItem.type === 'thesis' ? 'Edit thesis details' : 'Edit item details'}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p><strong>Title:</strong> {editingItem.title}</p>
                <p><strong>Author:</strong> {editingItem.author}</p>
                <p><strong>Status:</strong> {editingItem.status}</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle save logic here
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    color: 'white',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '400px',
              position: 'relative'
            }}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  Confirm Delete
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Are you sure you want to delete "{deleteItem.title}"? This action cannot be undone.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteItem(null);
                  }}
                  style={{
                    padding: '8px 16px',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    padding: '8px 16px',
                    color: 'white',
                    backgroundColor: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
