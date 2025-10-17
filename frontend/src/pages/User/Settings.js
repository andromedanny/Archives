import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const Settings = () => {
  const [accountData, setAccountData] = useState({
    email: 'user@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    downloadNotifications: true
  });
  
  const [problemReport, setProblemReport] = useState({
    type: '',
    description: ''
  });
  
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle account settings update
      console.log('Update account:', accountData);
      setMessage('Account settings updated successfully!');
    } catch (error) {
      setMessage('Error updating account settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle notification settings update
      console.log('Update notifications:', notificationSettings);
      setMessage('Notification settings updated successfully!');
    } catch (error) {
      setMessage('Error updating notification settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProblemReportSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle problem report submission
      console.log('Submit problem report:', problemReport);
      setMessage('Problem report submitted successfully!');
      setProblemReport({ type: '', description: '' });
    } catch (error) {
      setMessage('Error submitting problem report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Handle password reset
      console.log('Reset password for:', passwordResetEmail);
      setMessage('Password reset email sent!');
      setPasswordResetEmail('');
    } catch (error) {
      setMessage('Error sending password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Settings - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-4xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('successfully') || message.includes('sent')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                Account Settings
              </h2>
              
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={accountData.currentPassword}
                    onChange={(e) => setAccountData({...accountData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Required for changing password</p>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={accountData.newPassword}
                    onChange={(e) => setAccountData({...accountData, newPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={accountData.confirmPassword}
                    onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                Notification Settings
              </h2>
              
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-7">
                  Receive email notifications for thesis updates and comments
                </p>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="downloadNotifications"
                    checked={notificationSettings.downloadNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      downloadNotifications: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="downloadNotifications" className="text-sm font-medium text-gray-700">
                    Download Notifications
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-7">
                  Get notified when someone downloads your thesis
                </p>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Report a Problem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                Report a Problem
              </h2>
              
              <form onSubmit={handleProblemReportSubmit} className="space-y-4">
                <div>
                  <label htmlFor="problemType" className="block text-sm font-medium text-gray-700 mb-1">
                    Problem Type
                  </label>
                  <select
                    id="problemType"
                    value={problemReport.type}
                    onChange={(e) => setProblemReport({...problemReport, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a problem type</option>
                    <option value="technical">Technical Issue</option>
                    <option value="content">Content Issue</option>
                    <option value="access">Access Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="problemDescription"
                    value={problemReport.description}
                    onChange={(e) => setProblemReport({...problemReport, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-green-500">
                Help & Support
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Forgot Password?</h3>
                  <p className="text-gray-600 mb-3">
                    Enter your email to reset your password. You will receive an email with instructions.
                  </p>
                  <form onSubmit={handlePasswordReset} className="flex gap-3">
                    <input
                      type="email"
                      value={passwordResetEmail}
                      onChange={(e) => setPasswordResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Reset Password'}
                    </button>
                  </form>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Contact Support</h3>
                  <p className="text-gray-600">
                    Need help? Contact our support team at{' '}
                    <a href="mailto:support@faithcolleges.edu" className="text-blue-600 hover:text-blue-700">
                      support@faithcolleges.edu
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Settings;
