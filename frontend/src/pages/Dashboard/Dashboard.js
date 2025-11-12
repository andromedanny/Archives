import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import BackgroundImage from '../../components/UI/BackgroundImage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';
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
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use real user from context
  const currentUser = user;
  
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentActivity: [],
    myTheses: [],
    upcomingEvents: [],
    departmentStats: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Dashboard: Component mounted, fetching data...');
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.error('Dashboard error:', error);
      setError('An error occurred. Please refresh the page.');
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    console.log('Dashboard state:', { isLoading, error, hasData: !!dashboardData.stats });
  }, [isLoading, error, dashboardData]);

  const fetchDashboardData = async () => {
    try {
      console.log('Dashboard: Starting to fetch data...');
      setIsLoading(true);
      setError(null);

      // Fetch real data from API
      const [statsResponse, activityResponse, thesesResponse, eventsResponse] = await Promise.all([
        dashboardAPI.getStats().catch(() => ({ data: { success: false } })),
        dashboardAPI.getActivity().catch(() => ({ data: { success: false, data: [] } })),
        dashboardAPI.getMyTheses(5).catch(() => ({ data: { success: false, data: [] } })),
        dashboardAPI.getUpcomingEvents(5).catch(() => ({ data: { success: false, data: [] } }))
      ]);

      const stats = statsResponse.data.success ? statsResponse.data.data : {};
      const activity = activityResponse.data.success ? (activityResponse.data.data || []) : [];
      const theses = thesesResponse.data.success ? (thesesResponse.data.data || []) : [];
      const events = eventsResponse.data.success ? (eventsResponse.data.data || []) : [];

      setDashboardData({
        stats,
        recentActivity: activity,
        myTheses: theses,
        upcomingEvents: events,
        departmentStats: {}
      });
      console.log('Dashboard: Data loaded successfully');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set empty data on error
      setDashboardData({
        stats: {},
        recentActivity: [],
        myTheses: [],
        upcomingEvents: [],
        departmentStats: {}
      });
      if (err.response?.status !== 401) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      console.log('Dashboard: Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const getRoleBasedStats = () => {
    const baseStats = dashboardData.stats || {};
    
    if (currentUser?.role === 'admin') {
      return [
        {
          title: 'Total Theses',
          value: baseStats.totalTheses || 0,
          icon: BookOpenIcon,
          color: 'blue',
          link: '/admin/theses'
        },
        {
          title: 'Total Users',
          value: baseStats.totalUsers || 0,
          icon: UserGroupIcon,
          color: 'green',
          link: '/admin/users'
        },
        {
          title: 'Departments',
          value: baseStats.totalDepartments || 0,
          icon: AcademicCapIcon,
          color: 'purple',
          link: '/admin/departments'
        },
        {
          title: 'Recent Submissions',
          value: baseStats.recentSubmissions || 0,
          icon: ClockIcon,
          color: 'orange',
          link: '/admin/theses?filter=recent'
        }
      ];
    } else {
      return [
        {
          title: 'My Theses',
          value: baseStats.myTheses || 0,
          icon: DocumentTextIcon,
          color: 'blue',
          link: '/my-theses'
        },
        {
          title: 'Published',
          value: baseStats.publishedTheses || 0,
          icon: BookOpenIcon,
          color: 'green',
          link: '/my-theses?status=published'
        },
        {
          title: 'Total Views',
          value: baseStats.totalViews || 0,
          icon: EyeIcon,
          color: 'purple',
          link: '/my-theses'
        },
        {
          title: 'Downloads',
          value: baseStats.totalDownloads || 0,
          icon: ArrowDownTrayIcon,
          color: 'orange',
          link: '/my-theses'
        }
      ];
    }
  };

  const getQuickActions = () => {
    if (currentUser?.role === 'admin') {
      return [
        {
          title: 'Manage Theses',
          description: 'Review and manage thesis submissions',
          icon: BookOpenIcon,
          color: 'blue',
          link: '/admin/theses'
        },
        {
          title: 'Manage Users',
          description: 'Add, edit, and manage user accounts',
          icon: UserGroupIcon,
          color: 'green',
          link: '/admin/users'
        },
        {
          title: 'Analytics',
          description: 'View system analytics and reports',
          icon: ChartBarIcon,
          color: 'purple',
          link: '/admin/analytics'
        },
        {
          title: 'Departments',
          description: 'Manage departments and programs',
          icon: AcademicCapIcon,
          color: 'orange',
          link: '/admin/departments'
        }
      ];
    } else {
      return [
        {
          title: 'Submit Thesis',
          description: 'Submit a new thesis for review',
          icon: PlusIcon,
          color: 'blue',
          link: '/thesis/create'
        },
        {
          title: 'Show all available Thesis',
          description: 'Browse all available theses',
          icon: BookOpenIcon,
          color: 'indigo',
          link: '/thesis'
        },
        {
          title: 'My Theses',
          description: 'View and manage your submitted theses',
          icon: DocumentTextIcon,
          color: 'green',
          link: '/my-theses'
        },
        {
          title: 'Calendar',
          description: 'View upcoming events and defenses',
          icon: CalendarIcon,
          color: 'purple',
          link: '/calendar'
        },
        {
          title: 'Profile',
          description: 'Update your profile information',
          icon: UserGroupIcon,
          color: 'orange',
          link: '/profile'
        }
      ];
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

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const now = new Date();
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Never';
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return formatDate(dateString);
    } catch (error) {
      return 'Never';
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
      },
      indigo: {
        text: '#4f46e5',
        bgLight: '#e0e7ff',
        bgMedium: '#c7d2fe',
        bgDark: '#a5b4fc',
        border: '#c7d2fe'
      }
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    console.log('Dashboard: Showing loading state');
    return (
      <>
        <BackgroundImage />
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BackgroundImage />
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  console.log('Dashboard: Rendering main content', { 
    currentUser, 
    dashboardData: Object.keys(dashboardData),
    statsCount: Object.keys(dashboardData.stats || {}).length 
  });
  
  return (
    <>
      <Helmet>
        <title>Dashboard - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Your personalized dashboard for the FAITH Colleges Thesis Archive" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-96" style={{ position: 'relative', zIndex: 1 }}>
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
                    Welcome back, {currentUser?.firstName || 'User'}!
                  </h1>
                  <p className="text-lg text-blue-100">
                    {currentUser?.role === 'admin' ? 'Administrative Dashboard' : 'Student Dashboard'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {getRoleBasedStats().map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + (index * 0.1) }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1"
                onClick={() => navigate(stat.link)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p style={{ color: getColorStyles(stat.color).text }} className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div 
                    className="p-3 rounded-xl transition-all duration-300 transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(to bottom right, ${getColorStyles(stat.color).bgLight}, ${getColorStyles(stat.color).bgMedium})`
                    }}
                  >
                    <stat.icon style={{ color: getColorStyles(stat.color).text }} className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            ))}
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
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full"></div>
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  {getQuickActions().map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-white transform hover:-translate-y-1"
                      onClick={() => navigate(action.link)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-xl transition-all duration-300 transform group-hover:rotate-6"
                          style={{
                            background: `linear-gradient(to bottom right, ${getColorStyles(action.color).bgLight}, ${getColorStyles(action.color).bgMedium})`
                          }}
                        >
                          <action.icon style={{ color: getColorStyles(action.color).text }} className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full"></div>
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {dashboardData.recentActivity && dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className={`p-1 rounded-full bg-${activity.type === 'thesis' ? 'blue' : 'green'}-100`}>
                        <DocumentTextIcon className={`h-4 w-4 text-${activity.type === 'thesis' ? 'blue' : 'green'}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                        <p className="text-xs text-gray-500">{formatTimeAgo(activity.date)}</p>
                      </div>
                    </motion.div>
                  ))}
                  {(!dashboardData.recentActivity || dashboardData.recentActivity.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* My Theses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                    My Theses
                  </h2>
                  <button
                    onClick={() => navigate('/my-theses')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {dashboardData.myTheses && dashboardData.myTheses.slice(0, 5).map((thesis, index) => (
                    <motion.div
                      key={thesis.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                      className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                      onClick={() => navigate(`/thesis/${thesis.id}`)}
                    >
                      <p className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{thesis.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${thesis.status === 'Published' ? 'green' : thesis.status === 'Under Review' ? 'yellow' : 'gray'}-100 text-${thesis.status === 'Published' ? 'green' : thesis.status === 'Under Review' ? 'yellow' : 'gray'}-800`}>
                          {thesis.status}
                        </span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(thesis.submittedAt)}</span>
                      </div>
                    </motion.div>
                  ))}
                  {(!dashboardData.myTheses || dashboardData.myTheses.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No theses yet</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Events - Separate row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 pb-32"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-600 to-green-400 rounded-full"></div>
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.upcomingEvents && dashboardData.upcomingEvents.slice(0, 3).map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-1 rounded-full bg-purple-100">
                      <CalendarIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(event.eventDate || event.date)}</p>
                    </div>
                  </motion.div>
                ))}
                {(!dashboardData.upcomingEvents || dashboardData.upcomingEvents.length === 0) && (
                  <p className="text-gray-500 text-center py-4 col-span-3">No upcoming events</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
    </>
  );
};

export default Dashboard;