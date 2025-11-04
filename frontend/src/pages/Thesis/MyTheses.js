import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const MyTheses = () => {
  const [theses, setTheses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTheses = [
      {
        id: 1,
        title: "Machine Learning Applications in Healthcare",
        course: "BSCS",
        year: "2023",
        submissionDate: "2023-05-15",
        status: "Published"
      },
      {
        id: 2,
        title: "Web Development Best Practices",
        course: "BSIT",
        year: "2023",
        submissionDate: "2023-06-20",
        status: "Under Review"
      }
    ];
    
    setTheses(mockTheses);
    setIsLoading(false);
  }, []);

  const handleEdit = (thesisId) => {
    // Navigate to edit page
    console.log('Edit thesis:', thesisId);
  };

  const handleDelete = (thesisId) => {
    if (window.confirm('Are you sure you want to delete this thesis?')) {
      // Handle deletion
      console.log('Delete thesis:', thesisId);
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
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-6xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Theses</h1>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your theses...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {theses.map((thesis) => (
                  <motion.div
                    key={thesis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {thesis.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span>{thesis.course}</span>
                          <span>•</span>
                          <span>{thesis.year}</span>
                          <span>•</span>
                          <span>Submitted: {thesis.submissionDate}</span>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          thesis.status === 'Published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {thesis.status}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(thesis.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(thesis.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {theses.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't submitted any theses yet.</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
