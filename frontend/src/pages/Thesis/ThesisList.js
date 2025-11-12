import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { thesisAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ThesisList = () => {
  const navigate = useNavigate();
  const [theses, setTheses] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    keywords: '',
    program: '',
    department: '',
    academicYear: '',
    category: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const fetchTheses = async () => {
    try {
      setIsLoading(true);
      
      // Build query parameters (Objective 5.3: Advanced search)
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.keywords && { keywords: filters.keywords }),
        ...(filters.program && { program: filters.program }),
        ...(filters.department && { department: filters.department }),
        ...(filters.academicYear && { academicYear: filters.academicYear }),
        ...(filters.category && { category: filters.category }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo })
      };

      const response = await thesisAPI.getTheses(params);
      if (response.data && response.data.success) {
        setTheses(response.data.data || []);
        setTotalCount(response.data.total || 0);
        setTotalPages(response.data.pages || 1);
      } else {
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
        if (response.data && response.data.message) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching theses:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle different error cases
      if (error.response?.status === 401) {
        // Authentication error - but thesis list is public, so this shouldn't happen
        // Just show empty state
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to view theses');
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
      } else if (error.response) {
        // Server error
        toast.error(error.response.data?.message || 'Failed to load theses');
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
      } else if (error.request) {
        // Network error
        toast.error('Network error. Please check your connection and try again.');
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
      } else {
        // Other error
        toast.error('Failed to load theses. Please try again.');
        setTheses([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch theses when filters or page changes (Objective 5.3: Advanced search)
  useEffect(() => {
    fetchTheses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.search, filters.keywords, filters.program, filters.department, filters.academicYear, filters.category, filters.dateFrom, filters.dateTo]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      keywords: '',
      program: '',
      department: '',
      academicYear: '',
      category: '',
      dateFrom: '',
      dateTo: ''
    });
    setCurrentPage(1);
  };

  const handleView = (thesisId) => {
    // Navigate to thesis detail page
    navigate(`/thesis/${thesisId}`);
  };

  const handleDownload = async (thesisId, thesisTitle) => {
    try {
      // Use downloadDocument if available, otherwise fallback to downloadThesis
      const downloadMethod = thesisAPI.downloadDocument || thesisAPI.downloadThesis;
      if (!downloadMethod) {
        toast.error('Download functionality is not available. Please refresh the page.');
        return;
      }
      
      const response = await downloadMethod(thesisId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${thesisTitle || 'thesis'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      if (error.response?.status === 404) {
        toast.error('PDF document not found');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to download this PDF');
      } else {
        toast.error('Failed to download PDF. The document may not be available.');
      }
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Thesis List - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Browse and search through the FAITH Colleges thesis collection" />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Thesis List</h1>
            
            {/* Advanced Search Filters (Objective 5.3: Advanced search) */}
            <div className="mb-6 space-y-4">
              {/* Basic Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Title/Abstract
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search thesis title or abstract..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={filters.keywords}
                    onChange={(e) => handleFilterChange('keywords', e.target.value)}
                    placeholder="e.g., AI, Machine Learning, Healthcare"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category and Program Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program
                  </label>
                  <select
                    value={filters.program}
                    onChange={(e) => handleFilterChange('program', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Programs</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSEMC">BSEMC</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={filters.academicYear}
                    onChange={(e) => handleFilterChange('academicYear', e.target.value)}
                    placeholder="e.g., 2024-2025"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Doctoral">Doctoral</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Thesis Table */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading theses...</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing {theses.length} of {totalCount} theses {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Title</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Authors</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Course</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Year</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Submission Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theses.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                            No theses found. Try adjusting your filters.
                          </td>
                        </tr>
                      ) : (
                        theses.map((thesis) => (
                          <motion.tr
                            key={thesis.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">{thesis.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-b">
                              {thesis.authors?.map(a => `${a.firstName} ${a.lastName}`).join(', ') || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.program || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-b">
                              {thesis.academic_year || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 border-b">
                              {thesis.submitted_at ? new Date(thesis.submitted_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm border-b">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleView(thesis.id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                  View
                                </button>
                                {thesis.main_document && thesis.main_document.path && (
                                  <button
                                    onClick={() => handleDownload(thesis.id, thesis.title)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                  >
                                    Download
                                  </button>
                                )}
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
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

export default ThesisList;
