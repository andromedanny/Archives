import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState({ thesisCount: 0, downloads: 0, views: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await usersAPI.getUserStats(user.id);
        const data = response.data || response;
        setStats({
          thesisCount: data.thesisCount ?? data.thesis_count ?? 0,
          downloads: data.downloadCount ?? data.download_count ?? 0,
          views: data.viewCount ?? data.view_count ?? 0,
        });
      } catch (error) {
        console.error('Failed to load profile stats:', error);
        toast.error('Unable to load profile statistics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileStats();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
          <p className="text-gray-500">We couldn t find your profile information.</p>
        </div>
        <Footer />
      </>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  const firstInitial = user.firstName?.[0] || user.email?.[0] || '';
  const lastInitial = user.lastName?.[0] || '';
  const initials = `${firstInitial}${lastInitial}`.toUpperCase().trim() || '?';
  const departmentName = user.department?.name || user.department || 'Not assigned';
  const courseName = user.course?.name || user.course || 'Not provided';
  const roleLabel = user.role ? user.role.replace(/_/g, ' ') : 'Student';
  const createdAt = user.createdAt || user.created_at;
  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Not available';
  const isActive = user.isActive ?? user.is_active ?? true;

  return (
    <>
      <Helmet>
        <title>Profile - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View your profile information" />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="w-11/12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                  {initials}
                </div>
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">{fullName}</h1>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Profile Details</h2>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-4">
                  <Detail label="Department" value={departmentName} />
                  <Detail label="Course" value={courseName} />
                  <Detail label="Member Since" value={joinDate} />
                  <Detail label="Contact Email" value={user.email} />
                  <Detail label="Status" value={isActive ? 'Active' : 'Inactive'} />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Thesis Activity</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Theses Submitted" value={stats.thesisCount} color="blue" />
                  <StatCard label="Downloads" value={stats.downloads} color="green" />
                  <StatCard label="Views" value={stats.views} color="purple" />
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
    <p className="text-sm text-gray-800 mt-1">{value || 'Not provided'}</p>
  </div>
);

const StatCard = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    green: 'bg-green-50 border-green-100 text-green-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
  };

  return (
    <div className={`rounded-2xl border ${colorClasses[color] || 'bg-gray-50 border-gray-100 text-gray-700'} p-4 shadow-sm`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
};

export default Profile;
