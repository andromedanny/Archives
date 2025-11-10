import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    course: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    downloadNotifications: true,
  });
  const [problemReport, setProblemReport] = useState({
    type: '',
    description: '',
  });
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setAccountData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        course: user.course || '',
      });
      setPasswordResetEmail(user.email || '');
    }
  }, [user]);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateProfile({
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        course: accountData.course,
      });
      setMessage('Account settings updated successfully.');
    } catch (error) {
      const errorMsg = error?.message || 'Error updating account settings.';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage('Password updated successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const errorMsg = error?.error || error?.message || 'Error updating password.';
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setMessage('Notification settings saved.');
  };

  const handleProblemReportSubmit = (e) => {
    e.preventDefault();
    setProblemReport({ type: '', description: '' });
    toast.success('Problem report submitted.');
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    toast.success('Password reset email sent (mock).');
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

            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.toLowerCase().includes('error') || message.toLowerCase().includes('mismatch')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {message}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={accountData.firstName}
                      onChange={(e) => setAccountData({ ...accountData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={accountData.lastName}
                      onChange={(e) => setAccountData({ ...accountData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course (Program)</label>
                  <input
                    type="text"
                    value={accountData.course}
                    onChange={(e) => setAccountData({ ...accountData, course: e.target.value.toUpperCase() })}
                    placeholder="e.g. BSIT"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use course code such as BSIT, BSCS, etc.</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800">Notification Settings</h2>
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Email notifications for thesis updates</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationSettings.downloadNotifications}
                    onChange={(e) => setNotificationSettings({
                      ...notificationSettings,
                      downloadNotifications: e.target.checked,
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Notify me when someone downloads my thesis</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Preferences
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Report a Problem</h2>
                <form onSubmit={handleProblemReportSubmit} className="space-y-4 mt-4">
                  <select
                    value={problemReport.type}
                    onChange={(e) => setProblemReport({ ...problemReport, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a problem type</option>
                    <option value="technical">Technical Issue</option>
                    <option value="content">Content Issue</option>
                    <option value="access">Access Issue</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                    rows="4"
                    value={problemReport.description}
                    onChange={(e) => setProblemReport({ ...problemReport, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the issue"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit Report
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">Forgot Password?</h2>
                <form onSubmit={handlePasswordReset} className="mt-3 flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={passwordResetEmail}
                    onChange={(e) => setPasswordResetEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Password
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800">Contact Support</h2>
                <p className="text-gray-600">
                  Need help? Contact our team at{' '}
                  <a href="mailto:support@faithcolleges.edu" className="text-blue-600 hover:text-blue-700">
                    support@faithcolleges.edu
                  </a>
                </p>
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
