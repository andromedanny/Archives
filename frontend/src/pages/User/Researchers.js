import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { usersAPI, thesisAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Researchers = () => {
  const [researchers, setResearchers] = useState([]);
  const [filteredResearchers, setFilteredResearchers] = useState([]);
  const [filters, setFilters] = useState({
    course: '',
    year: '',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchResearchers = async () => {
    try {
      setIsLoading(true);
      // Fetch users who have submitted theses (students, faculty, prof)
      const usersResponse = await usersAPI.getUsers({ role: ['student', 'faculty', 'prof'] });
      const thesesResponse = await thesisAPI.getTheses();
      
      if (usersResponse.data.success && thesesResponse.data.success) {
        const users = usersResponse.data.data || [];
        const theses = thesesResponse.data.data || [];
        
        // Group theses by author and create researcher objects
        const researchersData = users.map(user => {
          const userTheses = theses.filter(t => 
            t.authors?.includes(`${user.firstName} ${user.lastName}`) ||
            t.adviser?.id === user.id
          );
          
          return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            course: user.department || '',
            year: user.createdAt ? new Date(user.createdAt).getFullYear() : '',
            thesisCount: userTheses.length,
            theses: userTheses.map(t => ({
              id: t.id,
              title: t.title,
              year: t.academic_year || new Date(t.submitted_at || t.createdAt).getFullYear()
            }))
          };
        }).filter(r => r.thesisCount > 0); // Only show researchers with theses
        
        setResearchers(researchersData);
        setFilteredResearchers(researchersData);
      } else {
        setResearchers([]);
        setFilteredResearchers([]);
      }
    } catch (error) {
      console.error('Error fetching researchers:', error);
      setResearchers([]);
      setFilteredResearchers([]);
      if (error.response?.status !== 401) {
        toast.error('Failed to load researchers');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchers();
  }, []);

  // Filter researchers based on current filters
  useEffect(() => {
    let filtered = researchers;

    if (filters.course) {
      filtered = filtered.filter(researcher => researcher.course === filters.course);
    }

    if (filters.year) {
      filtered = filtered.filter(researcher => researcher.year === filters.year);
    }

    if (filters.search) {
      filtered = filtered.filter(researcher => 
        researcher.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredResearchers(filtered);
  }, [filters, researchers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Researchers - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Browse researchers and their thesis contributions" />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Researchers</h1>
            
            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search researchers..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
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
              </div>
            </div>

            {/* Researchers List */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading researchers...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredResearchers.map((researcher) => (
                  <motion.div
                    key={researcher.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Researcher Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {researcher.name}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{researcher.course}</span>
                          <span>•</span>
                          <span>{researcher.year}</span>
                          <span>•</span>
                          <span>{researcher.thesisCount} thesis{researcher.thesisCount !== 1 ? 'es' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Researcher Theses */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Thesis Contributions:</h4>
                      <div className="space-y-2">
                        {researcher.theses.map((thesis) => (
                          <div
                            key={thesis.id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                                  {thesis.title}
                                </h5>
                                <p className="text-sm text-gray-500 mt-1">
                                  Year: {thesis.year}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredResearchers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No researchers found matching your criteria.</p>
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

export default Researchers;
