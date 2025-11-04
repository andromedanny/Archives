import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalTheses: 0,
    totalUsers: 0,
    totalDownloads: 0,
    monthlySubmissions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockAnalytics = {
      totalTheses: 150,
      totalUsers: 45,
      totalDownloads: 1250,
      monthlySubmissions: [
        { month: 'Jan', count: 12 },
        { month: 'Feb', count: 18 },
        { month: 'Mar', count: 15 },
        { month: 'Apr', count: 22 },
        { month: 'May', count: 28 },
        { month: 'Jun', count: 35 }
      ]
    };
    
    setAnalytics(mockAnalytics);
    setIsLoading(false);
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
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-6xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-blue-50 p-6 rounded-lg"
              >
                <div className="text-3xl font-bold text-blue-600">{analytics.totalTheses}</div>
                <div className="text-sm text-gray-600">Total Theses</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-green-50 p-6 rounded-lg"
              >
                <div className="text-3xl font-bold text-green-600">{analytics.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-purple-50 p-6 rounded-lg"
              >
                <div className="text-3xl font-bold text-purple-600">{analytics.totalDownloads}</div>
                <div className="text-sm text-gray-600">Total Downloads</div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-orange-50 p-6 rounded-lg"
              >
                <div className="text-3xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-gray-600">Active Users</div>
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
                  {analytics.monthlySubmissions.map((item, index) => (
                    <div key={item.month} className="flex items-center">
                      <div className="w-12 text-sm text-gray-600">{item.month}</div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.count / 35) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-8 text-sm text-gray-600">{item.count}</div>
                    </div>
                  ))}
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
