import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalTheses: 0,
    totalUsers: 0,
    totalDownloads: 0,
    monthlySubmissions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await adminAPI.getAnalytics();
        if (response.data.success) {
          setAnalytics(response.data.data || {
            totalTheses: 0,
            totalUsers: 0,
            totalDownloads: 0,
            monthlySubmissions: []
          });
        } else {
          setAnalytics({
            totalTheses: 0,
            totalUsers: 0,
            totalDownloads: 0,
            monthlySubmissions: []
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics({
          totalTheses: 0,
          totalUsers: 0,
          totalDownloads: 0,
          monthlySubmissions: []
        });
        if (error.response?.status !== 401) {
          toast.error('Failed to load analytics');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

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
        <title>Admin Analytics - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View system analytics and reports" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20" style={{ position: 'relative', zIndex: 1 }}>
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-blue-600">{analytics.totalTheses}</div>
                <div className="text-sm text-gray-600 mt-1">Total Theses</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-green-600">{analytics.totalUsers}</div>
                <div className="text-sm text-gray-600 mt-1">Total Users</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-purple-600">{analytics.totalDownloads}</div>
                <div className="text-sm text-gray-600 mt-1">Total Downloads</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl font-bold text-orange-600">
                  {analytics.totalUsers > 0 ? Math.round((analytics.totalUsers / analytics.totalUsers) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Active Users</div>
              </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Submissions</h3>
                <div className="space-y-3">
                  {analytics.monthlySubmissions && analytics.monthlySubmissions.length > 0 ? (
                    analytics.monthlySubmissions.map((item, index) => {
                      const maxCount = Math.max(...analytics.monthlySubmissions.map(m => m.count), 1);
                      return (
                        <div key={item.month || index} className="flex items-center">
                          <div className="w-12 text-sm text-gray-600">{item.month}</div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-8 text-sm text-gray-600">{item.count}</div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-sm">No submission data available</p>
                  )}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Computer Science</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Information Technology</span>
                    <span className="text-sm font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Entertainment & Multimedia</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Export Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex gap-4"
            >
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Export PDF Report
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Export Excel Data
              </button>
              <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Generate Summary
              </button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AdminAnalytics;
