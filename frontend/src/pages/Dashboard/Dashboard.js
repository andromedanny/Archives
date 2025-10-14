import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import {
  BookOpenIcon,
  DocumentTextIcon,
  CalendarIcon,
  UsersIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { thesisAPI, calendarAPI, adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard data based on user role
  const { data: dashboardData, isLoading } = useQuery(
    ['dashboard', user?.role],
    async () => {
      if (user?.role === 'admin') {
        const response = await adminAPI.getDashboard();
        return response.data.data;
      } else {
        // For non-admin users, fetch their specific data
        const [myTheses, upcomingEvents] = await Promise.all([
          thesisAPI.getMyTheses(),
          calendarAPI.getUpcomingEvents(5, user?.department),
        ]);
        return {
          myTheses: myTheses.data.data,
          upcomingEvents: upcomingEvents.data.data,
        };
      }
    },
    {
      enabled: !!user,
    }
  );

  const getRoleSpecificContent = () => {
    if (user?.role === 'admin') {
      return <AdminDashboardContent data={dashboardData} />;
    } else if (user?.role === 'student') {
      return <StudentDashboardContent data={dashboardData} />;
    } else if (user?.role === 'faculty' || user?.role === 'adviser') {
      return <FacultyDashboardContent data={dashboardData} />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="mt-1 text-primary-100">
              Here's what's happening with your theses and research today.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Link
          to="/thesis/create"
          className="card hover:shadow-md transition-shadow duration-200"
        >
          <div className="card-body text-center">
            <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Create Thesis
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start a new research project
            </p>
          </div>
        </Link>

        <Link
          to="/thesis"
          className="card hover:shadow-md transition-shadow duration-200"
        >
          <div className="card-body text-center">
            <div className="mx-auto h-12 w-12 bg-success-100 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Browse Archive
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Explore published theses
            </p>
          </div>
        </Link>

        <Link
          to="/calendar"
          className="card hover:shadow-md transition-shadow duration-200"
        >
          <div className="card-body text-center">
            <div className="mx-auto h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Calendar
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              View upcoming events
            </p>
          </div>
        </Link>

        <Link
          to="/profile"
          className="card hover:shadow-md transition-shadow duration-200"
        >
          <div className="card-body text-center">
            <div className="mx-auto h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Profile
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account
            </p>
          </div>
        </Link>
      </motion.div>

      {/* Role-specific content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {getRoleSpecificContent()}
      </motion.div>
    </div>
  );
};

// Admin Dashboard Content
const AdminDashboardContent = ({ data }) => {
  if (!data) return null;

  const { statistics, recentActivities } = data;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Statistics */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">System Statistics</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {statistics.totalUsers}
              </div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {statistics.totalTheses}
              </div>
              <div className="text-sm text-gray-500">Total Theses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                {statistics.publishedTheses}
              </div>
              <div className="text-sm text-gray-500">Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-error-600">
                {statistics.pendingTheses}
              </div>
              <div className="text-sm text-gray-500">Pending Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {recentActivities.theses.slice(0, 3).map((thesis) => (
              <div key={thesis._id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {thesis.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    by {thesis.authors.map(a => a.firstName).join(', ')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`badge ${
                    thesis.status === 'Published' ? 'badge-success' :
                    thesis.status === 'Under Review' ? 'badge-warning' :
                    'badge-gray'
                  }`}>
                    {thesis.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Student Dashboard Content
const StudentDashboardContent = ({ data }) => {
  if (!data) return null;

  const { myTheses, upcomingEvents } = data;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* My Theses */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">My Theses</h3>
            <Link to="/my-theses" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
        </div>
        <div className="card-body">
          {myTheses.length > 0 ? (
            <div className="space-y-4">
              {myTheses.slice(0, 3).map((thesis) => (
                <div key={thesis._id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {thesis.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {thesis.department} • {thesis.academicYear}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className={`badge ${
                      thesis.status === 'Published' ? 'badge-success' :
                      thesis.status === 'Under Review' ? 'badge-warning' :
                      'badge-gray'
                    }`}>
                      {thesis.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No theses yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first thesis.
              </p>
              <div className="mt-6">
                <Link to="/thesis/create" className="btn-primary">
                  Create Thesis
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
            <Link to="/calendar" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
        </div>
        <div className="card-body">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event._id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for scheduled events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Faculty Dashboard Content
const FacultyDashboardContent = ({ data }) => {
  if (!data) return null;

  const { myTheses, upcomingEvents } = data;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Advised Theses */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Advised Theses</h3>
            <Link to="/my-theses" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
        </div>
        <div className="card-body">
          {myTheses.length > 0 ? (
            <div className="space-y-4">
              {myTheses.slice(0, 3).map((thesis) => (
                <div key={thesis._id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {thesis.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {thesis.authors.map(a => a.firstName).join(', ')}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className={`badge ${
                      thesis.status === 'Published' ? 'badge-success' :
                      thesis.status === 'Under Review' ? 'badge-warning' :
                      'badge-gray'
                    }`}>
                      {thesis.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No advised theses</h3>
              <p className="mt-1 text-sm text-gray-500">
                Students will appear here when they select you as their adviser.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
            <Link to="/calendar" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
        </div>
        <div className="card-body">
          {upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event._id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startDate).toLocaleDateString()} at {event.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming events</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for scheduled events.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
