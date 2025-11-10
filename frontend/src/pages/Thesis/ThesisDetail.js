import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
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
  const [showPdf, setShowPdf] = useState(false);

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
            setPdfUrl(thesisAPI.getDocumentUrl(id));
          }
        } else {
          toast.error('Failed to load thesis');
          navigate('/thesis');
        }
      } catch (error) {
        console.error('Error fetching thesis:', error);
        toast.error('Failed to load thesis');
        navigate('/thesis');
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
      const response = await thesisAPI.downloadDocument(id);
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
      toast.error('Failed to download PDF');
    }
  };

  const handleViewPdf = () => {
    setShowPdf(true);
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
              className="mb-6 text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              ← Back to Thesis List
            </button>

            {/* Thesis Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{thesis?.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <span><strong>Authors:</strong> {authorsText}</span>
                {thesis.program && <span><strong>Program:</strong> {thesis.program}</span>}
                {thesis.academic_year && <span><strong>Academic Year:</strong> {thesis.academic_year}</span>}
                <span><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded ${
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
                </span>
              </div>
            </div>

            {/* PDF Viewer Section */}
            {pdfUrl && (
              <div className="mb-8">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={handleViewPdf}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View PDF
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
                
                {showPdf && (
                  <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '800px' }}>
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full"
                      title="PDF Viewer"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Thesis Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Abstract</h2>
                <p className="text-gray-700 leading-relaxed">{thesis?.abstract || 'No abstract available'}</p>
              </div>

              {thesis.keywords && thesis.keywords.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {thesis.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {thesis.adviser && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Adviser</h2>
                  <p className="text-gray-700">
                    {thesis.adviser.firstName} {thesis.adviser.lastName}
                  </p>
                </div>
              )}

              {thesis.adviser_name && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Adviser</h2>
                  <p className="text-gray-700">{thesis.adviser_name}</p>
                </div>
              )}

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Submission Details</h2>
                <p className="text-gray-700">
                  Submitted on: {formatDate(thesis.createdAt || thesis.submitted_at)}
                </p>
                {thesis.view_count !== undefined && (
                  <p className="text-gray-700 mt-1">
                    Views: {thesis.view_count || 0} | Downloads: {thesis.download_count || 0}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons - Show if no PDF URL */}
            {!pdfUrl && (
              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
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
