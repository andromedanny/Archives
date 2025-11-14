import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { useAuth } from '../../contexts/AuthContext';
import { thesisAPI, departmentsAPI, coursesAPI, usersAPI } from '../../services/api';
import ProgressBar from '../../components/UI/ProgressBar';
import toast from 'react-hot-toast';

const ThesisCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const getDefaultSchoolYear = () => {
    const currentYear = new Date().getFullYear();
    return `${currentYear}-${currentYear + 1}`;
  };
  const userDepartmentFromProfile = user?.department?.name || user?.department || '';
  const userCourseFromProfile = user?.course?.code || user?.course || '';
  const isStudent = user?.role === 'student';
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    department: userDepartmentFromProfile,
    program: userCourseFromProfile,
    academicYear: getDefaultSchoolYear(),
    keywords: '',
    adviserId: ''
  });
  const userCourse = userCourseFromProfile || formData.program;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [coAuthors, setCoAuthors] = useState([]);
  const [showAuthorSearch, setShowAuthorSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingAuthors, setIsSearchingAuthors] = useState(false);
  
  // Upload progress tracking (Objective 4.3, 4.5: Clear feedback during file operations)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // 'uploading', 'success', 'error'

  // Fetch departments and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [deptsResponse, coursesResponse] = await Promise.all([
          departmentsAPI.getDepartments().catch((err) => {
            console.error('Error fetching departments:', err);
            return { data: { success: false, data: [] } };
          }),
          coursesAPI.getCourses().catch((err) => {
            console.error('Error fetching courses:', err);
            return { data: { success: false, data: [] } };
          })
        ]);

        console.log('Departments response:', deptsResponse.data);
        console.log('Courses response:', coursesResponse.data);

        if (deptsResponse.data && deptsResponse.data.success) {
          setDepartments(deptsResponse.data.data || []);
          console.log('Departments set:', deptsResponse.data.data);
        } else {
          console.error('Departments API failed:', deptsResponse.data);
          toast.error('Failed to load departments');
        }
        
        if (coursesResponse.data && coursesResponse.data.success) {
          setCourses(coursesResponse.data.data || []);
          console.log('Courses set:', coursesResponse.data.data);
        } else {
          console.error('Courses API failed:', coursesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching departments/courses:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on selected department
  const filteredCourses = formData.department 
    ? courses.filter(course => {
        const dept = departments.find(d => d.name === formData.department);
        return dept && course.department_id === dept.id;
      })
    : [];

  // Generate school year options (2025-2026 down to 2000-2001)
  const generateSchoolYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    // Start from current year + 1 (e.g., if 2024, start from 2025-2026)
    for (let year = currentYear + 1; year >= 2000; year--) {
      years.push(`${year}-${year + 1}`);
    }
    return years;
  };

  const schoolYears = generateSchoolYears();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (isStudent && formData.program !== userCourseFromProfile) {
      setFormData((prev) => ({ ...prev, program: userCourseFromProfile }));
    }
  }, [isStudent, userCourseFromProfile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only');
        e.target.value = '';
        return;
      }
      
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        e.target.value = '';
        return;
      }
      
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  const loadCoAuthorCandidates = async (query = '') => {
    try {
      setIsSearchingAuthors(true);
      console.log('[CoAuthor] Loading candidates', { query });
      const params = { 
        limit: 50,
        role: 'student'
      };
      // Department/course filtering is handled client-side for compatibility
      if (query.trim()) params.search = query.trim();
      const response = await usersAPI.getUsers(params);
      console.log('[CoAuthor] API response', response);
      const users = response.data?.data || response.data || [];
      console.log('[CoAuthor] Raw users', users);

      const normalize = (value, options = {}) => {
        if (!value) return '';
        let normalized = value.toString().trim().toLowerCase();
        if (options.removeSpaces) normalized = normalized.replace(/\s+/g, '');
        if (options.removeDashes) normalized = normalized.replace(/[-_]/g, '');
        return normalized;
      };

      const userDeptNorm = normalize(userDepartmentFromProfile);
      const userCourseNorm = normalize(userCourse, { removeSpaces: true, removeDashes: true });

      const filtered = users.filter((candidate) => {
        if (candidate.id === user?.id) return false;
        const candidateDeptRaw = candidate.department?.name || candidate.department || '';
        const candidateCourseRaw = candidate.course?.code || candidate.course || '';

        const candidateDeptNorm = normalize(candidateDeptRaw);
        const candidateCourseNorm = normalize(candidateCourseRaw, { removeSpaces: true, removeDashes: true });

        if (userDeptNorm && candidateDeptNorm && candidateDeptNorm !== userDeptNorm) {
          console.log('[CoAuthor] Filtering out due to department mismatch', { candidate: candidateDeptRaw, candidateDeptNorm, userDeptNorm });
          return false;
        }

        if (userCourseNorm && candidateCourseNorm && candidateCourseNorm !== userCourseNorm) {
          console.log('[CoAuthor] Filtering out due to course mismatch', { candidateCourseRaw, candidateCourseNorm, userCourseNorm });
          return false;
        }

        return !coAuthors.some((author) => author.id === candidate.id);
      });
      console.log('[CoAuthor] Filtered users', filtered);
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error loading potential co-authors:', error);
      const message = error.response?.data?.message || 'Unable to load potential co-authors.';
      toast.error(message);
      setSearchResults([]);
    } finally {
      setIsSearchingAuthors(false);
    }
  };

  const openAuthorSearch = () => {
    console.log('[CoAuthor] Toggle author search');
    if (!showAuthorSearch) {
      setSearchQuery('');
      setSearchResults([]);
      setShowAuthorSearch(true);
      loadCoAuthorCandidates().catch((error) => {
        console.error('Error initializing co-author list:', error);
      });
    } else {
      closeAuthorSearch();
    }
  };

  const closeAuthorSearch = () => {
    setShowAuthorSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchAuthors = async (query) => {
    setSearchQuery(query);
    console.log('[CoAuthor] Searching authors', query);
    try {
      await loadCoAuthorCandidates(query);
    } catch (error) {
      console.error('Error searching authors:', error);
    }
  };

  useEffect(() => {
    console.log('[CoAuthor] showAuthorSearch changed:', showAuthorSearch);
  }, [showAuthorSearch]);

  const handleAddCoAuthor = (candidate) => {
    if (!candidate || coAuthors.some((author) => author.id === candidate.id) || candidate.id === user?.id) {
      return;
    }
    setCoAuthors((prev) => [...prev, candidate]);
    toast.success(`${candidate.firstName || candidate.email} added as co-author`);
    setSearchResults((prev) => prev.filter((person) => person.id !== candidate.id));
  };

  const handleRemoveCoAuthor = (id) => {
    setCoAuthors((prev) => prev.filter((author) => author.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const thesisData = {
        title: formData.title.trim(),
        abstract: formData.abstract.trim(),
        department: formData.department,
        program: isStudent ? userCourseFromProfile || null : formData.program,
        academicYear: formData.academicYear,
        semester: '1st Semester', // Default semester value
        category: 'Undergraduate', // Default category value
        keywords: formData.keywords 
          ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
          : [],
        coAuthorIds: [user?.id, ...coAuthors.map((author) => author.id)].filter(Boolean)
        // Note: adviserId is not sent since adviser is now a text input (adviser name only)
      };

      // Create thesis first
      const response = await thesisAPI.createThesis(thesisData);
      
      if (response.data.success) {
        const thesisId = response.data.data.id;
        
        // Upload PDF if provided (Objective 4.3, 4.5: Upload with progress tracking)
        if (pdfFile) {
          try {
            setIsUploading(true);
            setUploadProgress(0);
            setUploadStatus('uploading');
            
            // Upload with progress tracking
            await thesisAPI.uploadDocument(thesisId, pdfFile, (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
              }
            });
            
            setUploadProgress(100);
            setUploadStatus('success');
            toast.success('Thesis created and PDF uploaded successfully!');
            
            // Reset progress after a delay
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
              setUploadStatus('');
            }, 2000);
          } catch (uploadError) {
            console.error('Error uploading PDF:', uploadError);
            setUploadStatus('error');
            setUploadProgress(0);
            toast.error('Thesis created but PDF upload failed. You can upload it later.');
            setIsUploading(false);
          }
        } else {
          toast.success('Thesis created successfully!');
        }
        
        navigate('/my-theses');
      } else {
        throw new Error(response.data.message || 'Failed to create thesis');
      }
    } catch (error) {
      console.error('Error creating thesis:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Failed to create thesis. Please check all required fields.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Thesis - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Submit a new thesis to the archive" />
      </Helmet>
      
      <BackgroundImage />
      <Header />
      
      <main className="min-h-screen pt-16 pb-20" style={{ position: 'relative', zIndex: 1 }}>
        <div className="w-11/12 max-w-4xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Thesis</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter thesis title"
                />
              </div>

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
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter thesis abstract"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department (College) *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData((prev) => ({ ...prev, program: '' }));
                    }}
                    required
                    disabled={isStudent || isLoadingData}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">{isLoadingData ? 'Loading departments...' : 'Select Department'}</option>
                    {departments
                      .filter((d) => d.is_active !== false)
                      .map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                  </select>
                </div>

                {!isStudent && (
                  <div>
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                      Program (Course) *
                    </label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      required
                      disabled={!formData.department || isLoadingData}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    >
                      <option value="">{formData.department ? 'Select Program' : 'Select Department first'}</option>
                      {filteredCourses
                        .filter((c) => c.is_active)
                        .map((course) => (
                          <option key={course.id} value={course.code}>
                            {course.name} ({course.code})
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-2">
                    School Year *
                  </label>
                  <select
                    id="academicYear"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {schoolYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="adviserId" className="block text-sm font-medium text-gray-700 mb-2">
                    Adviser (Optional)
                  </label>
                  <input
                    type="text"
                    id="adviserId"
                    name="adviserId"
                    value={formData.adviserId}
                    onChange={handleChange}
                    placeholder="Enter adviser name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authors
                </label>
                <div className="border border-gray-200 rounded-lg bg-gray-50">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-[10px] text-gray-500 leading-tight">Primary author</p>
                    </div>
                      <button
                        type="button"
                        onClick={openAuthorSearch}
                        className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold px-3 py-1 rounded border border-blue-100 hover:bg-blue-50 transition"
                      >
                        <span className="text-base leading-none">{showAuthorSearch ? '×' : '+'}</span>
                        <span>{showAuthorSearch ? 'Close' : 'Add Co-author'}</span>
                      </button>
                  </div>
                  {showAuthorSearch && (
                    <div className="px-4 pb-4 space-y-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchAuthors(e.target.value)}
                        placeholder="Search classmate name or email"
                        className="w-full px-3 py-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y bg-white">
                        {isSearchingAuthors ? (
                          <p className="text-sm text-gray-500 px-3 py-2">Searching…</p>
                        ) : searchResults.length === 0 ? (
                          <p className="text-sm text-gray-500 px-3 py-2">
                            {searchQuery.length < 2
                              ? 'Type at least 2 characters to search.'
                              : 'No matching students found.'}
                          </p>
                        ) : (
                          searchResults.map((candidate) => (
                            <button
                              type="button"
                              key={candidate.id}
                              onClick={() => handleAddCoAuthor(candidate)}
                              className="w-full text-left px-3 py-2 hover:bg-blue-50 transition"
                            >
                              <p className="text-sm font-medium text-gray-800">
                                {candidate.firstName} {candidate.lastName}
                              </p>
                              <p className="text-xs text-gray-500">{candidate.email}</p>
                              <p className="text-[10px] text-gray-400">
                                {candidate.department?.name || candidate.department || ''}
                                {candidate.course?.code ? ` ${candidate.course.code}` : ''}
                              </p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  {coAuthors.length > 0 && (
                    <div className="divide-y">
                      {coAuthors.map((author) => (
                        <div key={author.id} className="px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{author.firstName} {author.lastName}</p>
                            <p className="text-xs text-gray-500">{author.email}</p>
                            <p className="text-[10px] text-gray-400">{author.department?.name || author.department || ''}{author.course?.code ? ` ${author.course.code}` : ''}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoAuthor(author.id)}
                            className="text-xs text-red-500 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="Machine Learning, Healthcare, AI"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">Separate keywords with commas</p>
              </div>

              <div className="mt-6">
                <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Document
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="pdfFile"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {pdfFileName && (
                    <span className="ml-3 text-sm text-gray-600">
                      {pdfFileName}
                    </span>
                  )}
                </div>
                
                {/* Upload Progress Indicator (Objective 4.3, 4.5: Clear feedback) */}
                {isUploading && (
                  <div className="mt-4">
                    <ProgressBar 
                      progress={uploadProgress}
                      label={uploadStatus === 'uploading' ? 'Uploading PDF...' : uploadStatus === 'success' ? 'Upload complete!' : 'Upload failed'}
                      color={uploadStatus === 'success' ? 'green' : uploadStatus === 'error' ? 'red' : 'blue'}
                    />
                    {uploadStatus === 'uploading' && (
                      <p className="mt-2 text-xs text-gray-500">
                        Please wait while your file is being uploaded. Do not close this page.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Creating...' : 'Create Thesis'}
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

export default ThesisCreate;
