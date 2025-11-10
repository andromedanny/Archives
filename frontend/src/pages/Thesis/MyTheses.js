import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { thesisAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MyTheses = () => {
  const [theses, setTheses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTheses = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching my theses...');
      const response = await thesisAPI.getMyTheses();
      console.log('My theses response:', response.data);
      if (response.data.success) {
        const thesesData = response.data.data || [];
        console.log('Setting theses:', thesesData.length, 'items');
        console.log('Thesis titles:', thesesData.map(t => t.title));
        setTheses(thesesData);
      } else {
        console.log('Response was not successful:', response.data);
        setTheses([]);
      }
    } catch (error) {
      console.error('Error fetching theses:', error);
      console.error('Error response:', error.response?.data);
      setTheses([]);
      if (error.response?.status !== 401) {
        toast.error('Failed to load your theses');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleView = (thesisId) => {
    navigate(`/thesis/${thesisId}`);
  };

  const handleEdit = (thesisId) => {
    navigate(`/thesis/${thesisId}/edit`);
  };

  const handleDownload = async (thesisId, thesisTitle) => {
    try {
      const response = await thesisAPI.downloadDocument(thesisId);
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
      toast.error('Failed to download PDF. The document may not be available.');
    }
  };

  const handleDelete = async (thesisId) => {
    if (window.confirm('Are you sure you want to delete this thesis?')) {
      try {
        await thesisAPI.deleteThesis(thesisId);
        toast.success('Thesis deleted successfully');
        fetchTheses();
      } catch (error) {
        console.error('Error deleting thesis:', error);
        toast.error(error.response?.data?.message || 'Failed to delete thesis');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>My Theses - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="View and manage your submitted theses" />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Theses</h1>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your theses...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {theses.map((thesis) => {
                  // Format date
                  const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    try {
                      const date = new Date(dateString);
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    } catch {
                      return dateString;
                    }
                  };

                  // Format status
                  const getStatusDisplay = (status) => {
                    if (!status) return 'Draft';
                    return typeof status === 'string' 
                      ? status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : status;
                  };

                  const statusDisplay = getStatusDisplay(thesis.status);
                  const isPublished = thesis.status === 'Published' || thesis.status === 'published';
                  const isUnderReview = thesis.status === 'Under Review' || thesis.status === 'under_review';
                  const isDraft = thesis.status === 'Draft' || thesis.status === 'draft';
                  const isRejected = thesis.status === 'Rejected' || thesis.status === 'rejected';

                  return (
                    <motion.div
                      key={thesis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {thesis.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            {thesis.program && <span>{thesis.program}</span>}
                            {thesis.program && thesis.academic_year && <span>•</span>}
                            {thesis.academic_year && <span>{thesis.academic_year}</span>}
                            {(thesis.program || thesis.academic_year) && <span>•</span>}
                            <span>Submitted: {formatDate(thesis.createdAt || thesis.submitted_at)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              isPublished
                                ? 'bg-green-100 text-green-800' 
                                : isUnderReview
                                ? 'bg-yellow-100 text-yellow-800'
                                : isDraft
                                ? 'bg-blue-100 text-blue-800'
                                : isRejected
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {statusDisplay}
                            </span>
                            {thesis.main_document && thesis.main_document.path && (
                              <span className="text-xs text-green-600 font-medium">✓ PDF Attached</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4 flex-wrap">
                          <button
                            onClick={() => handleView(thesis.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                          >
                            View
                          </button>
                          {thesis.main_document && thesis.main_document.path && (
                            <button
                              onClick={() => handleDownload(thesis.id, thesis.title)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                            >
                              PDF
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(thesis.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(thesis.id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {theses.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't submitted any theses yet.</p>
                    <button 
                      onClick={() => navigate('/thesis/create')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Your First Thesis
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default MyTheses;
