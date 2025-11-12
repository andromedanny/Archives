import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeftIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  AcademicCapIcon,
  TagIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { thesisAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ThesisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        setIsLoading(true);
        const response = await thesisAPI.getThesis(id);
        if (response.data.success) {
          const thesisData = response.data.data;
          setThesis(thesisData);
          
          // Check if thesis has a document
          if (thesisData.main_document && thesisData.main_document.path) {
            // Get the document URL - token will be included in the request via axios interceptor
            if (thesisAPI.getDocumentUrl) {
              const documentUrl = thesisAPI.getDocumentUrl(id);
              // For iframe viewing, we need to include the token in the URL
              const token = localStorage.getItem('token');
              const fullUrl = token ? `${documentUrl}?token=${token}` : documentUrl;
              setPdfUrl(fullUrl);
            } else {
              // Fallback: construct URL manually if getDocumentUrl is not available
              const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
                ? import.meta.env.VITE_API_URL 
                : '/api';
              const token = localStorage.getItem('token');
              const fullUrl = token ? `${baseURL}/thesis/${id}/view?token=${token}` : `${baseURL}/thesis/${id}/view`;
              setPdfUrl(fullUrl);
            }
          }
        } else {
          toast.error('Failed to load thesis');
          navigate('/thesis');
        }
      } catch (error) {
        console.error('Error fetching thesis:', error);
        // Check if it's a function error (missing methods) vs API error
        if (error.message && error.message.includes('is not a function')) {
          // This is a code issue - methods missing from build
          console.error('API methods missing - this is a build issue. Please redeploy the frontend.');
          toast.error('Some features may not work. Please refresh the page or contact support.');
          // Don't navigate away - allow user to see what loaded
        } else if (error.response?.status === 404) {
          toast.error('Thesis not found');
          navigate('/thesis');
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to view this thesis');
          navigate('/thesis');
        } else if (error.response) {
          // Server error
          toast.error('Failed to load thesis. Please try again.');
        } else if (error.request) {
          // Network error
          toast.error('Network error. Please check your connection and try again.');
        } else {
          // Other error
          toast.error('Failed to load thesis. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchThesis();
    }
  }, [id, navigate]);

  const handleDownload = async () => {
    try {
      // Use downloadDocument if available, otherwise fallback to downloadThesis
      const downloadMethod = thesisAPI.downloadDocument || thesisAPI.downloadThesis;
      if (!downloadMethod) {
        toast.error('Download functionality is not available. Please refresh the page.');
        return;
      }
      
      const response = await downloadMethod(id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${thesis?.title || 'thesis'}.pdf`;
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
        toast.error('Failed to download PDF. Please try again.');
      }
    }
  };

  const handleViewThesis = () => {
    if (!pdfUrl) {
      toast.error('PDF URL is not available. Please check if the backend is running.');
      return;
    }
    window.open(pdfUrl, '_blank');
  };

  const handleBack = () => {
    navigate('/thesis');
  };

  // Format authors
  const authorsText = thesis?.authors && Array.isArray(thesis.authors) && thesis.authors.length > 0
    ? thesis.authors.map(author => `${author.firstName || ''} ${author.lastName || ''}`).filter(Boolean).join(', ')
    : thesis?.authors || 'N/A';

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

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

  if (!thesis) {
    return (
      <>
        <BackgroundImage />
        <Header />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Thesis not found</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Thesis List
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{thesis?.title} - FAITH Colleges Thesis Archive</title>
        <meta name="description" content={thesis?.abstract} />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-7xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-medium"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Thesis List
            </button>

            {/* Thesis Header */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{thesis?.title}</h1>
              
              {/* Thesis Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Authors</p>
                    <p className="text-sm text-gray-700 mt-1">{authorsText}</p>
                  </div>
                </div>
                
                {thesis.program && (
                  <div className="flex items-start gap-3">
                    <AcademicCapIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Program</p>
                      <p className="text-sm text-gray-700 mt-1">{thesis.program}</p>
                    </div>
                  </div>
                )}
                
                {thesis.academic_year && (
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Academic Year</p>
                      <p className="text-sm text-gray-700 mt-1">{thesis.academic_year}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status:</span>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  thesis.status === 'Published' || thesis.status === 'published'
                    ? 'bg-green-100 text-green-800' 
                    : thesis.status === 'Under Review' || thesis.status === 'under_review'
                    ? 'bg-yellow-100 text-yellow-800'
                    : thesis.status === 'Draft' || thesis.status === 'draft'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {typeof thesis.status === 'string' ? thesis.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : thesis.status}
                </span>
              </div>
            </div>

            {/* PDF Action Buttons */}
            {pdfUrl && (
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleViewThesis}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium"
                  >
                    <EyeIcon className="h-5 w-5" />
                    View Thesis
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
            
            {/* Show message if PDF is not available */}
            {!pdfUrl && thesis && (
              <div className="mb-8 p-5 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                <div className="flex items-start gap-3">
                  <DocumentTextIcon className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 font-medium">
                      PDF Document Not Available
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      This thesis does not have a PDF document uploaded yet.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Thesis Content */}
            <div className="space-y-8">
              {/* Abstract Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                  Abstract
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{thesis?.abstract || 'No abstract available'}</p>
              </div>

              {/* Keywords Section */}
              {thesis.keywords && thesis.keywords.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TagIcon className="h-6 w-6 text-blue-600" />
                    Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {thesis.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Adviser Section */}
              {(thesis.adviser || thesis.adviser_name) && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-blue-600" />
                    Adviser
                  </h2>
                  <p className="text-gray-700 text-lg">
                    {thesis.adviser 
                      ? `${thesis.adviser.firstName} ${thesis.adviser.lastName}` 
                      : thesis.adviser_name}
                  </p>
                </div>
              )}

              {/* Submission Details Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                  Submission Details
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 min-w-[120px]">Submitted on:</span>
                    <span className="text-gray-700">{formatDate(thesis.createdAt || thesis.submitted_at)}</span>
                  </div>
                  {thesis.view_count !== undefined && (
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{thesis.view_count || 0}</span> views
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowDownTrayIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">{thesis.download_count || 0}</span> downloads
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Show if no PDF URL */}
            {!pdfUrl && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg font-medium"
                >
                  <PrinterIcon className="h-5 w-5" />
                  Print
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ThesisDetail;
