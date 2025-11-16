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
    departmentStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await adminAPI.getAnalytics();
        if (response.data.success) {
          setAnalytics({
            totalTheses: response.data.data?.totalTheses || 0,
            totalUsers: response.data.data?.totalUsers || 0,
            departmentStats: response.data.data?.departmentStats || [],
          });
        } else {
          setAnalytics({
            totalTheses: 0,
            totalUsers: 0,
            departmentStats: [],
          });
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setAnalytics({
          totalTheses: 0,
          totalUsers: 0,
          departmentStats: [],
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </div>

            {/* Department Statistics with Users and Theses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Thesis Submissions</h3>
              <div className="space-y-6">
                {analytics.departmentStats && analytics.departmentStats.length > 0 ? (
                  (() => {
                    const maxTheses = Math.max(...analytics.departmentStats.map(d => d.totalTheses || 0), 1);
                    const maxUsers = Math.max(...analytics.departmentStats.map(d => d.totalUsers || 0), 1);
                    return analytics.departmentStats.map((dept, index) => (
                      <div key={dept.department || index} className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-semibold text-gray-800">
                            {dept.department || 'Unknown Department'}
                          </div>
                        </div>
                        
                        {/* Total Theses Bar */}
                        <div className="flex items-center">
                          <div className="w-32 text-xs text-gray-600">Theses:</div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-blue-600 h-4 rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${Math.min((dept.totalTheses / maxTheses) * 100, 100)}%` }}
                              >
                                <span className="text-xs text-white font-medium">{dept.totalTheses || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Total Users Bar */}
                        <div className="flex items-center">
                          <div className="w-32 text-xs text-gray-600">Users:</div>
                          <div className="flex-1 mx-4">
                            <div className="bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-green-600 h-4 rounded-full flex items-center justify-end pr-2"
                                style={{ width: `${Math.min((dept.totalUsers / maxUsers) * 100, 100)}%` }}
                              >
                                <span className="text-xs text-white font-medium">{dept.totalUsers || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()
                ) : (
                  <p className="text-gray-500 text-sm">No department data available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AdminAnalytics;
