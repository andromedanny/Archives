import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const ThesisList = () => {
  const [theses, setTheses] = useState([]);
  const [filteredTheses, setFilteredTheses] = useState([]);
  const [filters, setFilters] = useState({
    course: '',
    year: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockTheses = [
      {
        id: 1,
        title: "Machine Learning Applications in Healthcare",
        authors: "John Doe, Jane Smith",
        course: "BSCS",
        year: "2023",
        submissionDate: "2023-05-15"
      },
      {
        id: 2,
        title: "Web Development Best Practices",
        authors: "Alice Johnson",
        course: "BSIT",
        year: "2023",
        submissionDate: "2023-06-20"
      },
      {
        id: 3,
        title: "Game Development Using Unity",
        authors: "Bob Wilson, Carol Brown",
        course: "BSEMC",
        year: "2022",
        submissionDate: "2022-12-10"
      }
    ];
    
    setTheses(mockTheses);
    setFilteredTheses(mockTheses);
    setIsLoading(false);
  }, []);

  // Filter theses based on current filters
  useEffect(() => {
    let filtered = theses;

    if (filters.course) {
      filtered = filtered.filter(thesis => thesis.course === filters.course);
    }

    if (filters.year) {
      filtered = filtered.filter(thesis => thesis.year === filters.year);
    }

    if (filters.search) {
      filtered = filtered.filter(thesis => 
        thesis.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        thesis.authors.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredTheses(filtered);
    setCurrentPage(1);
  }, [filters, theses]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleView = (thesisId) => {
    // Navigate to thesis detail page
    console.log('View thesis:', thesisId);
  };

  const handleDownload = (thesisId) => {
    // Handle download
    console.log('Download thesis:', thesisId);
  };

  // Pagination
  const totalPages = Math.ceil(filteredTheses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTheses = filteredTheses.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Helmet>
        <title>Thesis List - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Browse and search through the FAITH Colleges thesis collection" />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Thesis List</h1>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
              >
                <option value="">All Courses</option>
                <option value="BSCS">Computer Science</option>
                <option value="BSIT">Information Technology</option>
                <option value="BSEMC">Entertainment and Multimedia Computing</option>
              </select>
              
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                <option value="">All Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
              
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search thesis title..."
                className="flex-1 min-w-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Thesis Table */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading theses...</p>
              </div>
            ) : (
              <>
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
                      {paginatedTheses.map((thesis) => (
                        <motion.tr
                          key={thesis.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 border-b">{thesis.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.authors}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.course}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.year}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.submissionDate}</td>
                          <td className="px-4 py-3 text-sm border-b">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleView(thesis.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDownload(thesis.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Download
                              </button>
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

export default ThesisList;
