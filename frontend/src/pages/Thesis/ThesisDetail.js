import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const ThesisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockThesis = {
      id: id,
      title: "Machine Learning Applications in Healthcare",
      authors: "John Doe, Jane Smith",
      course: "BSCS",
      year: "2023",
      submissionDate: "2023-05-15",
      abstract: "This thesis explores the applications of machine learning in healthcare...",
      keywords: ["Machine Learning", "Healthcare", "AI", "Medical Diagnosis"],
      advisor: "Dr. Smith",
      status: "Published"
    };
    
    setThesis(mockThesis);
    setIsLoading(false);
  }, [id]);

  const handleDownload = () => {
    // Handle download
    console.log('Download thesis:', id);
  };

  const handleBack = () => {
    navigate('/thesis');
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

  return (
    <>
      <Helmet>
        <title>{thesis?.title} - FAITH Colleges Thesis Archive</title>
        <meta name="description" content={thesis?.abstract} />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-4xl mx-auto mt-8">
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
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span><strong>Authors:</strong> {thesis?.authors}</span>
                <span><strong>Course:</strong> {thesis?.course}</span>
                <span><strong>Year:</strong> {thesis?.year}</span>
                <span><strong>Status:</strong> {thesis?.status}</span>
              </div>
            </div>

            {/* Thesis Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Abstract</h2>
                <p className="text-gray-700 leading-relaxed">{thesis?.abstract}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {thesis?.keywords?.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Advisor</h2>
                <p className="text-gray-700">{thesis?.advisor}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Submission Details</h2>
                <p className="text-gray-700">Submitted on: {thesis?.submissionDate}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Print
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ThesisDetail;
