import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { thesisAPI, departmentsAPI, coursesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ThesisEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    department: '',
    program: '',
    academicYear: '',
    semester: '1st Semester',
    category: 'Undergraduate',
    keywords: []
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchThesis();
    fetchDepartments();
    fetchCourses();
  }, [id]);

  const fetchThesis = async () => {
    try {
      const response = await thesisAPI.getThesis(id);
      if (response.data.success) {
        const thesis = response.data.data;
        // Format authors array to string
        const authorsString = thesis.authors 
          ? thesis.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')
          : '';
        
        setFormData({
          title: thesis.title || '',
          abstract: thesis.abstract || '',
          authors: authorsString,
          department: thesis.department || '',
          program: thesis.program || '',
          academicYear: thesis.academic_year || '',
          semester: thesis.semester || '1st Semester',
          category: thesis.category || 'Undergraduate',
          keywords: Array.isArray(thesis.keywords) ? thesis.keywords : []
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching thesis:', error);
      toast.error('Failed to load thesis');
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentsAPI.getDepartments();
      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await coursesAPI.getCourses();
      if (response.data.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleKeywordChange = (e) => {
    const keywordsString = e.target.value;
    const keywordsArray = keywordsString.split(',').map(k => k.trim()).filter(k => k);
    setFormData({
      ...formData,
      keywords: keywordsArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await thesisAPI.updateThesis(id, formData);
      if (response.data.success) {
        toast.success('Thesis updated successfully!');
        navigate('/my-theses');
      } else {
        throw new Error(response.data.message || 'Failed to update thesis');
      }
    } catch (error) {
      console.error('Error updating thesis:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Failed to update thesis';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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

  return (
    <>
      <Helmet>
        <title>Edit Thesis - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Edit thesis information" />
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
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Thesis</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Thesis Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Abstract */}
              <div>
                <label htmlFor="abstract" className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract *
                </label>
                <textarea
                  id="abstract"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide a brief summary of your thesis..."
                />
              </div>

              {/* Authors */}
              <div>
                <label htmlFor="authors" className="block text-sm font-medium text-gray-700 mb-2">
                  Authors (read-only)
                </label>
                <input
                  type="text"
                  id="authors"
                  name="authors"
                  value={formData.authors}
                  readOnly
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder="Authors cannot be changed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Authors are automatically set when the thesis is created
                </p>
              </div>

              {/* Department & Program */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                    Program *
                  </label>
                  <select
                    id="program"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Program</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.code}>
                        {course.name} ({course.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Academic Year & Semester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    required
                    placeholder="2023-2024"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords.join(', ')}
                  onChange={handleKeywordChange}
                  placeholder="Machine Learning, Healthcare, AI"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Thesis'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/my-theses')}
                  className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default ThesisEdit;
