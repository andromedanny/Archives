import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { thesisAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdviserTheses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [theses, setTheses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchTheses = async () => {
    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };
      const response = await thesisAPI.getAdviserDepartmentTheses(params);
      if (response.data && response.data.success) {
        setTheses(response.data.data || []);
        setTotalCount(response.data.total || 0);
        setTotalPages(response.data.pages || 1);
      } else {
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching theses:', error);
      setTheses([]);
      setTotalCount(0);
      setTotalPages(1);
      if (error.response?.status !== 401) {
        toast.error('Failed to load theses');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, [currentPage]);

  const handleApprove = async (thesisId) => {
    if (!window.confirm('Are you sure you want to approve this thesis? Only administrators can publish it.')) {
      return;
    }
    try {
      await thesisAPI.updateThesis(thesisId, { status: 'Approved' });
      toast.success('Thesis approved successfully. An administrator will review and publish it.');
      fetchTheses();
    } catch (error) {
      console.error('Error approving thesis:', error);
      toast.error(error.response?.data?.message || 'Failed to approve thesis');
    }
  };

  const handleReject = async (thesisId) => {
    if (!window.confirm('Are you sure you want to reject this thesis?')) {
      return;
    }
    try {
      await thesisAPI.updateThesis(thesisId, { status: 'Rejected' });
      toast.success('Thesis rejected successfully');
      fetchTheses();
    } catch (error) {
      console.error('Error rejecting thesis:', error);
      toast.error(error.response?.data?.message || 'Failed to reject thesis');
    }
  };

  const handleViewPDF = (thesisId) => {
    try {
      const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
        ? import.meta.env.VITE_API_URL 
        : '/api';
      const token = localStorage.getItem('token');
      const pdfUrl = token 
        ? `${baseURL}/thesis/${thesisId}/view?token=${token}` 
        : `${baseURL}/thesis/${thesisId}/view`;
      
      window.location.href = pdfUrl;
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error('Failed to open PDF. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'under review':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTheses = theses.filter(thesis => {
    const matchesSearch = !searchTerm || 
      thesis.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thesis.abstract?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (thesis.status || '').toLowerCase().replace(' ', '_') === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const getCreatorName = (thesis) => {
    if (Array.isArray(thesis.authors) && thesis.authors.length > 0) {
      return thesis.authors.map(author => `${author.firstName || ''} ${author.lastName || ''}`.trim()).filter(Boolean).join(', ');
    }
    return 'N/A';
  };

  return (
    <>
      <Helmet>
        <title>Department Theses - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Manage theses in your department" />
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Department Theses</h1>
              <p className="text-gray-600">
                Managing theses for <span className="font-semibold">{user?.department || 'your department'}</span>
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search theses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading theses...</p>
              </div>
            ) : filteredTheses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No theses found</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {filteredTheses.length} of {totalCount} theses {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Authors</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Program</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Submitted</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTheses.map((thesis) => (
                        <motion.tr
                          key={thesis.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{thesis.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{getCreatorName(thesis)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.program || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm border-b">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(thesis.status)}`}>
                              {thesis.status || 'Draft'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">
                            {thesis.submitted_at ? new Date(thesis.submitted_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm border-b">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleViewPDF(thesis.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                <EyeIcon className="h-4 w-4" />
                                View
                              </button>
                              {(thesis.status === 'Under Review' || thesis.status === 'Draft') && (
                                <>
                                  <button
                                    onClick={() => handleApprove(thesis.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(thesis.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 border rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AdviserTheses;

