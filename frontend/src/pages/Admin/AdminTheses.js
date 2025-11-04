import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminTheses = () => {
  const [theses, setTheses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingThesis, setEditingThesis] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    authors: '',
    course: '',
    year: '',
    department: '',
    status: 'draft',
    isPublic: true
  });

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTheses = [
      {
        id: 1,
        title: "Machine Learning Applications in Healthcare",
        abstract: "This thesis explores the application of machine learning algorithms in healthcare systems...",
        authors: "John Doe, Jane Smith",
        course: "BSCS",
        year: "2023",
        department: "Computer Science",
        submissionDate: "2023-05-15",
        status: "published",
        isPublic: true,
        viewCount: 45,
        downloadCount: 12
      },
      {
        id: 2,
        title: "Web Development Best Practices",
        abstract: "A comprehensive study on modern web development practices and frameworks...",
        authors: "Alice Johnson",
        course: "BSIT",
        year: "2023",
        department: "Information Technology",
        submissionDate: "2023-06-20",
        status: "under_review",
        isPublic: false,
        viewCount: 23,
        downloadCount: 5
      },
      {
        id: 3,
        title: "Database Optimization Techniques",
        abstract: "Research on advanced database optimization methods for large-scale applications...",
        authors: "Bob Wilson, Carol Davis",
        course: "BSCS",
        year: "2023",
        department: "Computer Science",
        submissionDate: "2023-07-10",
        status: "draft",
        isPublic: false,
        viewCount: 8,
        downloadCount: 2
      },
      {
        id: 4,
        title: "Mobile App Development Trends",
        abstract: "Analysis of current trends in mobile application development...",
        authors: "David Brown",
        course: "BSEMC",
        year: "2023",
        department: "Entertainment and Multimedia Computing",
        submissionDate: "2023-08-05",
        status: "rejected",
        isPublic: false,
        viewCount: 15,
        downloadCount: 3
      }
    ];
    
    setTheses(mockTheses);
    setIsLoading(false);
  }, []);

  const handleEdit = (thesis) => {
    setEditingThesis(thesis);
    setFormData({
      title: thesis.title,
      abstract: thesis.abstract,
      authors: thesis.authors,
      course: thesis.course,
      year: thesis.year,
      department: thesis.department,
      status: thesis.status,
      isPublic: thesis.isPublic
    });
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    console.log('Add New Thesis clicked - opening modal');
    setEditingThesis(null);
    setFormData({
      title: '',
      abstract: '',
      authors: '',
      course: '',
      year: '',
      department: '',
      status: 'draft',
      isPublic: true
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    console.log('Saving thesis:', formData);
    if (editingThesis) {
      // Update existing thesis
      setTheses(theses.map(thesis => 
        thesis.id === editingThesis.id 
          ? { ...thesis, ...formData }
          : thesis
      ));
      setShowEditModal(false);
    } else {
      // Add new thesis
      const newThesis = {
        id: theses.length + 1,
        ...formData,
        submissionDate: new Date().toISOString().split('T')[0],
        viewCount: 0,
        downloadCount: 0
      };
      console.log('Adding new thesis:', newThesis);
      setTheses([...theses, newThesis]);
      setShowAddModal(false);
    }
    setEditingThesis(null);
  };

  const handleApprove = (thesisId) => {
    setTheses(theses.map(thesis => 
      thesis.id === thesisId 
        ? { ...thesis, status: 'published', isPublic: true }
        : thesis
    ));
  };

  const handleReject = (thesisId) => {
    setTheses(theses.map(thesis => 
      thesis.id === thesisId 
        ? { ...thesis, status: 'rejected' }
        : thesis
    ));
  };

  const handleDelete = (thesisId) => {
    if (window.confirm('Are you sure you want to delete this thesis?')) {
      setTheses(theses.filter(thesis => thesis.id !== thesisId));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const filteredTheses = theses.filter(thesis => {
    const matchesSearch = thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thesis.authors.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || thesis.status === filterStatus;
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
      
      <main className="min-h-screen pt-16 pb-20">
        <div className="w-11/12 max-w-6xl mx-auto mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Manage Theses</h1>
              <button 
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Thesis
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
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Title</th>
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
                    {filteredTheses.map((thesis) => (
                      <motion.tr
                        key={thesis.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 border-b font-medium">
                          {thesis.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.authors}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.course}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.year}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{thesis.department}</td>
                        <td className="px-4 py-3 text-sm border-b">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            thesis.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : thesis.status === 'under_review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : thesis.status === 'draft'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {thesis.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
                              onClick={() => handleEdit(thesis)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Edit
                            </button>
                            {thesis.status === 'under_review' && (
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
                    ))}
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
                  {editingThesis ? 'Edit Thesis' : 'Add New Thesis'}
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
                      Authors *
                    </label>
                    <input
                      type="text"
                      name="authors"
                      value={formData.authors}
                      onChange={handleInputChange}
                      required
                      placeholder="Separate multiple authors with commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course *
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Course</option>
                      <option value="BSCS">BSCS - Bachelor of Science in Computer Science</option>
                      <option value="BSIT">BSIT - Bachelor of Science in Information Technology</option>
                      <option value="BSEMC">BSEMC - Bachelor of Science in Entertainment and Multimedia Computing</option>
                      <option value="BSIS">BSIS - Bachelor of Science in Information Systems</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year *
                    </label>
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 2023-2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Entertainment and Multimedia Computing">Entertainment and Multimedia Computing</option>
                      <option value="Information Systems">Information Systems</option>
                    </select>
                  </div>
                </div>

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
