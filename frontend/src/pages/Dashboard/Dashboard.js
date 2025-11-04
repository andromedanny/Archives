import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import apiService from '../../services/apiService';
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
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock user for testing when backend auth is not working
  const mockUser = {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@faith.edu.ph',
    role: 'admin',
    department: 'Computer Science',
    isActive: true
  };
  
  // Use mock user if real user is not available
  const currentUser = user || mockUser;
  
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // For now, use mock data since backend routes are not working
      // TODO: Replace with real API calls when backend is fixed
      const mockStats = {
        totalTheses: 150,
        totalUsers: 45,
        totalDepartments: 3,
        recentSubmissions: 12,
        myTheses: 5,
        publishedTheses: 3,
        totalViews: 1250,
        totalDownloads: 89,
        pendingReviews: 8
      };

      const mockActivity = [
        {
          type: 'thesis',
          title: 'New thesis submitted: "Machine Learning Applications in Healthcare"',
          date: new Date().toISOString(),
          author: 'John Doe'
        },
        {
          type: 'user',
          title: 'New user registered: Jane Smith',
          date: new Date(Date.now() - 3600000).toISOString(),
          role: 'student'
        },
        {
          type: 'thesis',
          title: 'Thesis "Web Development Best Practices" status: Published',
          date: new Date(Date.now() - 7200000).toISOString(),
          status: 'Published'
        }
      ];

      const mockTheses = [
        {
          id: 1,
          title: 'Machine Learning Applications in Healthcare',
          status: 'Published',
          submittedAt: new Date().toISOString(),
          viewCount: 45,
          downloadCount: 12
        },
        {
          id: 2,
          title: 'Web Development Best Practices',
          status: 'Under Review',
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          viewCount: 23,
          downloadCount: 5
        },
        {
          id: 3,
          title: 'Database Optimization Techniques',
          status: 'Draft',
          submittedAt: new Date(Date.now() - 172800000).toISOString(),
          viewCount: 8,
          downloadCount: 2
        }
      ];

      const mockEvents = [
        {
          id: 1,
          title: 'Thesis Defense - Machine Learning Research',
          eventDate: new Date(Date.now() + 86400000).toISOString(),
          eventType: 'thesis_defense',
          location: 'Room 101'
        },
        {
          id: 2,
          title: 'Department Meeting',
          eventDate: new Date(Date.now() + 172800000).toISOString(),
          eventType: 'meeting',
          location: 'Conference Room A'
        },
        {
          id: 3,
          title: 'Title Defense - Web Development',
          eventDate: new Date(Date.now() + 259200000).toISOString(),
          eventType: 'title_defense',
          location: 'Room 205'
        }
      ];

      const mockDeptStats = {
        department: {
          name: 'Computer Science',
          code: 'CS',
          description: 'Computer Science Department'
        },
        thesisCount: 45,
        userCount: 120,
        recentSubmissions: 8
      };

      setDashboardData({
        stats: mockStats,
        recentActivity: mockActivity,
        myTheses: mockTheses,
        upcomingEvents: mockEvents,
        departmentStats: mockDeptStats
      });

      // Uncomment below when backend is working:
      /*
      const [stats, activity, theses, events, deptStats] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivity(),
        apiService.getMyTheses(5),
        apiService.getUpcomingEvents(5),
        apiService.getDepartmentStats()
      ]);

      setDashboardData({
        stats,
        recentActivity: activity,
        myTheses: theses,
        upcomingEvents: events,
        departmentStats: deptStats
      });
      */
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBasedStats = () => {
    const baseStats = dashboardData.stats;
    
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
          link: '/thesis/my-theses'
        },
        {
          title: 'Published',
          value: baseStats.publishedTheses || 0,
          icon: BookOpenIcon,
          color: 'green',
          link: '/thesis/my-theses?status=published'
        },
        {
          title: 'Total Views',
          value: baseStats.totalViews || 0,
          icon: EyeIcon,
          color: 'purple',
          link: '/thesis/my-theses'
        },
        {
          title: 'Downloads',
          value: baseStats.totalDownloads || 0,
          icon: ArrowDownTrayIcon,
          color: 'orange',
          link: '/thesis/my-theses'
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
          title: 'My Theses',
          description: 'View and manage your submitted theses',
          icon: DocumentTextIcon,
          color: 'green',
          link: '/thesis/my-theses'
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <>
        <BackgroundImage />
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <LoadingSpinner />
        </div>
        <Footer />
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
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Your personalized dashboard for the FAITH Colleges Thesis Archive" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img 
                  src="/faith logo.png" 
                  alt="FAITH Colleges Logo" 
                  className="h-16 w-auto"
                />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Welcome back, {currentUser?.firstName || 'User'}!
                  </h1>
                  <p className="text-lg text-gray-600">
                    {currentUser?.role === 'admin' ? 'Administrative Dashboard' : 'Student Dashboard'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last login: {formatTimeAgo(currentUser?.lastLogin)}</p>
                <p className="text-sm text-gray-500">Department: {currentUser?.department}</p>
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
                className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(stat.link)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 group-hover:bg-${stat.color}-200 transition-colors`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getQuickActions().map((action, index) => (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
                      onClick={() => navigate(action.link)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-${action.color}-100 group-hover:bg-${action.color}-200 transition-colors`}>
                          <action.icon className={`h-5 w-5 text-${action.color}-600`} />
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
              className="space-y-6"
            >
              {/* Recent Activity */}
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {dashboardData.recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
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
                  {dashboardData.recentActivity.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
                <div className="space-y-3">
                  {dashboardData.upcomingEvents.slice(0, 3).map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.1) }}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="p-1 rounded-full bg-purple-100">
                        <CalendarIcon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{event.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                      </div>
                    </motion.div>
                  ))}
                  {dashboardData.upcomingEvents.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No upcoming events</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Dashboard;