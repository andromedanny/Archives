import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { thesisAPI, departmentsAPI, coursesAPI, adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { formatCourseCode, formatAcademicYear } from '../../utils/formatters';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminTheses = () => {
  const [theses, setTheses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingThesis, setEditingThesis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    department: '',
    program: '',
    academicYear: '',
    semester: '1st Semester',
    category: 'Undergraduate',
    status: 'draft',
    isPublic: true
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');

  const statusLabelMap = {
    draft: 'Draft',
    under_review: 'Under Review',
    published: 'Published',
    rejected: 'Rejected',
    approved: 'Approved'
  };

  const academicYearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 2000; year--) {
      years.push(`${year}-${year + 1}`);
    }
    return years;
  }, []);

  const fetchTheses = async () => {
    try {
      setIsLoading(true);
      // Use admin API to get all theses (including drafts)
      const response = await adminAPI.getTheses();
      if (response.data.success) {
        setTheses(response.data.data || []);
      } else {
        setTheses([]);
      }
    } catch (error) {
      console.error('Error fetching theses:', error);
      setTheses([]);
      if (error.response?.status !== 401) {
        toast.error('Failed to load theses');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
    fetchDepartmentsAndCourses();
  }, []);

  const fetchDepartmentsAndCourses = async () => {
    try {
      const [deptsResponse, coursesResponse] = await Promise.all([
        departmentsAPI.getDepartments().catch(() => ({ data: { success: false, data: [] } })),
        coursesAPI.getCourses().catch(() => ({ data: { success: false, data: [] } }))
      ]);

      if (deptsResponse.data.success) {
        setDepartments(deptsResponse.data.data || []);
      }
      if (coursesResponse.data.success) {
        setCourses(coursesResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching departments/courses:', error);
    }
  };

  // Prepare course options (allow admin to pick any course, but prioritize selected department)
  const activeCourses = courses.filter(course => course.is_active !== false);
  const filteredCourses = formData.department
    ? activeCourses.filter(course => {
        const dept = departments.find(d => d.name === formData.department);
        return dept && course.department_id === dept.id;
      })
    : activeCourses;

  const getCourseLabel = (course) => {
    const dept = departments.find(d => d.id === course.department_id);
    return dept ? `${course.code} - ${course.name} (${dept.code || dept.name})` : `${course.code} - ${course.name}`;
  };

  const handleEdit = (thesis) => {
    setEditingThesis(thesis);
    // Format authors for display (convert array to string)
    const authorsDisplay = Array.isArray(thesis.authors)
      ? thesis.authors.map(author => `${author.firstName || ''} ${author.lastName || ''}`.trim()).filter(Boolean).join(', ')
      : thesis.authors || '';
    
    setFormData({
      title: thesis.title,
      abstract: thesis.abstract,
      authors: authorsDisplay,
      department: thesis.department || '',
      program: thesis.program || thesis.course || '',
      academicYear: thesis.academic_year || thesis.year || '',
      semester: thesis.semester || '1st Semester',
      category: thesis.category || 'Undergraduate',
      status: (thesis.status || 'Draft').toLowerCase().replace(' ', '_'),
      isPublic: thesis.isPublic ?? thesis.is_public ?? true
    });
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    console.log('Add Old Thesis clicked - opening modal');
    setEditingThesis(null);
    setFormData({
      title: '',
      abstract: '',
      authors: '',
      department: '',
      program: '',
      academicYear: '',
      semester: '1st Semester',
      category: 'Undergraduate',
      status: 'draft',
      isPublic: true
    });
    setPdfFile(null);
    setPdfFileName('');
    setShowAddModal(true);
  };

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

  const handleSave = async () => {
    try {
      if (!formData.department || !formData.program || !formData.academicYear) {
        toast.error('Please complete the department, course, and academic year fields.');
        return;
      }

      // Validate PDF upload for new theses
      if (!editingThesis && !pdfFile) {
        toast.error('Please upload a PDF document.');
        return;
      }

      const statusForApi = statusLabelMap[formData.status] || 'Draft';

      if (editingThesis) {
        const { authors, ...rest } = formData;
        const updatePayload = {
          title: rest.title,
          abstract: rest.abstract,
          department: rest.department,
          program: rest.program,
          academicYear: rest.academicYear,
          semester: rest.semester,
          category: rest.category,
          status: statusForApi,
          isPublic: rest.isPublic
        };

        await thesisAPI.updateThesis(editingThesis.id, updatePayload);
        toast.success('Thesis updated successfully');
        setShowEditModal(false);
        fetchTheses();
      } else {
        const createPayload = {
          title: formData.title.trim(),
          abstract: formData.abstract.trim(),
          department: formData.department,
          program: formData.program,
          academicYear: formData.academicYear,
          semester: formData.semester,
          category: formData.category,
          keywords: []
        };

        const response = await thesisAPI.createThesis(createPayload);

        if (response.data?.success) {
          const createdThesis = response.data.data;
          const requiresFollowUp =
            formData.status !== 'draft' || formData.isPublic !== true;

          if (requiresFollowUp) {
            await thesisAPI.updateThesis(createdThesis.id, {
              status: statusForApi,
              isPublic: formData.isPublic
            });
          }

          // Upload PDF if provided
          if (pdfFile) {
            try {
              await thesisAPI.uploadDocument(createdThesis.id, pdfFile);
              toast.success('Thesis created and PDF uploaded successfully!');
            } catch (uploadError) {
              console.error('Error uploading PDF:', uploadError);
              toast.error('Thesis created but PDF upload failed. You can upload it later.');
            }
          } else {
            toast.success('Thesis created successfully');
          }

          setShowAddModal(false);
          fetchTheses();
        } else {
          throw new Error(response.data?.message || 'Failed to create thesis');
        }
      }

      setFormData({
        title: '',
        abstract: '',
        authors: '',
        department: '',
        program: '',
        academicYear: '',
        semester: '1st Semester',
        category: 'Undergraduate',
        status: 'draft',
        isPublic: true
      });
      setPdfFile(null);
      setPdfFileName('');
      setEditingThesis(null);
    } catch (error) {
      console.error('Error saving thesis:', error);
      toast.error(error.response?.data?.message || 'Failed to save thesis');
    }
  };

  const handleApprove = async (thesisId) => {
    try {
      await thesisAPI.updateThesis(thesisId, { status: 'Published', isPublic: true });
      toast.success('Thesis approved and published');
      fetchTheses();
    } catch (error) {
      console.error('Error approving thesis:', error);
      toast.error(error.response?.data?.message || 'Failed to approve thesis');
    }
  };

  const handleReject = async (thesisId) => {
    try {
      await thesisAPI.updateThesis(thesisId, { status: 'Rejected' });
      toast.success('Thesis rejected');
      fetchTheses();
    } catch (error) {
      console.error('Error rejecting thesis:', error);
      toast.error(error.response?.data?.message || 'Failed to reject thesis');
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

  const handleViewPDF = (thesisId) => {
    try {
      // Get the PDF view URL
      const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
        ? import.meta.env.VITE_API_URL 
        : '/api';
      const token = localStorage.getItem('token');
      const pdfUrl = token 
        ? `${baseURL}/thesis/${thesisId}/view?token=${token}` 
        : `${baseURL}/thesis/${thesisId}/view`;
      
      // Open PDF in the same window (direct viewing)
      window.location.href = pdfUrl;
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error('Failed to open PDF. Please try again.');
    }
  };

  const getCreatorName = (thesis) => {
    if (Array.isArray(thesis.authors) && thesis.authors.length > 0) {
      const creator = thesis.authors[0]; // First author is typically the creator
      const lastName = creator.lastName || '';
      const firstName = creator.firstName || '';
      if (lastName && firstName) {
        return `${lastName}, ${firstName}`;
      } else if (lastName) {
        return lastName;
      } else if (firstName) {
        return firstName;
      }
    }
    return 'Unknown';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredTheses = theses.filter(thesis => {
    const title = (thesis.title || '').toLowerCase();
    const authorsString = Array.isArray(thesis.authors)
      ? thesis.authors.map(author => `${author.firstName || ''} ${author.lastName || ''}`.trim()).join(' ').toLowerCase()
      : (thesis.authors || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || title.includes(searchLower) || authorsString.includes(searchLower);
    const thesisStatus = (thesis.status || '').toLowerCase();
    const matchesStatus = filterStatus === 'all' || thesisStatus === filterStatus || thesisStatus.replace(' ', '_') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Helmet>
        <title>Admin Theses - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Manage all thesis submissions" />
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Manage Theses</h1>
              <button 
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add Old Thesis
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search theses by title or authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading theses...</p>
              </div>
            ) : filteredTheses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'No theses match your search criteria' 
                    : 'No theses found'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Creator</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Authors</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Course</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Year</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Views</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Downloads</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTheses.map((thesis) => {
                      const thesisStatus = (thesis.status || '').toLowerCase().replace(' ', '_');
                      return (
                        <motion.tr
                          key={thesis.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900 border-b font-medium">
                            {thesis.main_document?.path ? (
                              <button
                                onClick={() => handleViewPDF(thesis.id)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                                title="Click to view PDF"
                              >
                                <DocumentTextIcon className="h-4 w-4" />
                                <span>{thesis.title}</span>
                              </button>
                            ) : (
                              <span className="text-gray-500">{thesis.title}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">
                            {thesis.main_document?.path ? (
                              <button
                                onClick={() => handleViewPDF(thesis.id)}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                                title="Click to view PDF"
                              >
                                {getCreatorName(thesis)}
                              </button>
                            ) : (
                              <span className="text-gray-500">{getCreatorName(thesis)}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">
                            <div className="group relative">
                              {(() => {
                                if (Array.isArray(thesis.authors) && thesis.authors.length > 0) {
                                  // Format as "Surname (et al)" if multiple authors
                                  if (thesis.authors.length === 1) {
                                    const author = thesis.authors[0];
                                    return `${author.lastName || ''}${author.lastName && author.firstName ? ', ' : ''}${author.firstName || ''}`.trim();
                                  } else {
                                    // Get first author's surname
                                    const firstAuthor = thesis.authors[0];
                                    const surname = firstAuthor.lastName || firstAuthor.firstName || '';
                                    return (
                                      <>
                                        <span className="cursor-help">{surname} (et al.)</span>
                                        {/* Tooltip showing all authors */}
                                        <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 bg-gray-800 text-white text-xs rounded-lg shadow-lg p-3 min-w-[200px]">
                                          <div className="font-semibold mb-2">All Authors:</div>
                                          <div className="space-y-1">
                                            {thesis.authors.map((author, idx) => (
                                              <div key={idx}>
                                                {author.lastName || ''}{author.lastName && author.firstName ? ', ' : ''}{author.firstName || ''}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  }
                                }
                                return thesis.authors || 'N/A';
                              })()}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{formatCourseCode(thesis.course || thesis.program)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{formatAcademicYear(thesis.year || thesis.academic_year)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.department}</td>
                          <td className="px-4 py-3 text-sm border-b">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              thesisStatus === 'published'
                                ? 'bg-green-100 text-green-800'
                                : thesisStatus === 'under_review'
                                ? 'bg-yellow-100 text-yellow-800'
                                : thesisStatus === 'draft'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {(thesis.status || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b text-center">
                            {thesis.viewCount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 border-b text-center">
                            {thesis.downloadCount}
                          </td>
                          <td className="px-4 py-3 text-sm border-b">
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleViewPDF(thesis.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                <EyeIcon className="h-4 w-4" />
                                View
                              </button>
                              <button
                                onClick={() => handleEdit(thesis)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                <PencilIcon className="h-4 w-4" />
                                Edit
                              </button>
                              {thesisStatus === 'under_review' && (
                                <>
                                  <button
                                    onClick={() => handleApprove(thesis.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(thesis.id)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                  >
                                    <XMarkIcon className="h-4 w-4" />
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(thesis.id)}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />

      {/* Edit Thesis Modal */}
      {(showEditModal || showAddModal) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" 
          style={{ 
            zIndex: 99999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
            style={{ 
              zIndex: 100000,
              backgroundColor: 'white',
              position: 'relative'
            }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingThesis ? 'Edit Thesis' : 'Add Old Thesis'}
                </h2>
                <button
                  onClick={() => {
                    console.log('Closing modal');
                    setShowEditModal(false);
                    setShowAddModal(false);
                    setEditingThesis(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Abstract *
                  </label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Authors {editingThesis ? '(Read-only)' : '*'}
                    </label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      required={!editingThesis}
                      disabled={!!editingThesis}
                      placeholder="Separate multiple authors with commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-600"
                    />
                    {editingThesis && (
                      <p className="mt-1 text-xs text-gray-500">
                        Authors cannot be edited. Only the thesis creator can add co-authors.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                    </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={(e) => {
                        handleInputChange(e);
                      setFormData(prev => ({ ...prev, program: '' })); // Reset course when department changes
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.filter(d => d.is_active).map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course *
                    </label>
                    <select
                    name="program"
                    value={formData.program}
                      onChange={handleInputChange}
                      required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value="">Select Course</option>
                    {filteredCourses.map((course) => (
                      <option key={course.id} value={course.code}>
                        {getCourseLabel(course)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Doctoral">Doctoral</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>

                {!editingThesis && (
                  <div>
                    <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload PDF Document *
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        id="pdfFile"
                        accept=".pdf,application/pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {pdfFileName && (
                        <span className="ml-3 text-sm text-gray-600">
                          {pdfFileName}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Maximum file size: 10MB. PDF format only.
                    </p>
                  </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Make Public
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setShowAddModal(false);
                      setEditingThesis(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <CheckIcon className="h-4 w-4" />
                    {editingThesis ? 'Update Thesis' : 'Add Thesis'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminTheses;
