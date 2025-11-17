import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminDepartments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showThesesModal, setShowThesesModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head: '',
    contactInfo: '',
    isActive: true
  });

  // Check URL parameter to open add modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowAddModal(true);
      // Remove the query parameter from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getDepartments();
      if (response.data.success) {
        setDepartments(response.data.data || []);
      } else {
        toast.error('Failed to load departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name || '',
      code: department.code || '',
      description: department.description || '',
      head: department.head || '',
      contactInfo: department.contactInfo || department.email || '',
      isActive: department.is_active !== false
    });
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    setEditingDepartment(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      head: '',
      contactInfo: '',
      isActive: true
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingDepartment) {
        // Update existing department
        const response = await adminAPI.updateDepartment(editingDepartment.id, formData);
        if (response.data.success) {
          toast.success('Department updated successfully');
          fetchDepartments(); // Refresh departments
          setShowEditModal(false);
        } else {
          toast.error(response.data.message || 'Failed to update department');
        }
      } else {
        // Add new department
        const response = await adminAPI.createDepartment(formData);
        if (response.data.success) {
          toast.success('Department added successfully');
          fetchDepartments(); // Refresh departments
          setShowAddModal(false);
        } else {
          toast.error(response.data.message || 'Failed to add department');
        }
      }
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('Failed to save department');
    }
    setEditingDepartment(null);
  };

  const handleDelete = async (deptId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        const response = await adminAPI.deleteDepartment(deptId);
        if (response.data.success) {
          toast.success('Department deleted successfully');
          fetchDepartments(); // Refresh departments
        } else {
          toast.error(response.data.message || 'Failed to delete department');
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        toast.error('Failed to delete department');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleViewTheses = (department) => {
    setSelectedDepartment(department);
    setShowThesesModal(true);
  };


  return (
    <>
      <Helmet>
        <title>Admin Departments - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Manage departments" />
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
              <h1 className="text-3xl font-bold text-gray-800">Manage Departments</h1>
              <button 
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Department
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading departments...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{dept.name}</h3>
                          <p className="text-sm text-gray-500">
                            {dept.courses && dept.courses.length > 0
                              ? `${dept.courses.length} Course${dept.courses.length > 1 ? 's' : ''}`
                              : 'No courses yet'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.is_active !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dept.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 whitespace-pre-line">{dept.description || 'No description provided.'}</p>
                      {dept.courses && dept.courses.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Available Courses</p>
                          <div className="flex flex-wrap gap-2">
                            {dept.courses.slice(0, 4).map(course => (
                              <span
                                key={course.id}
                                className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full border border-blue-100"
                              >
                                {course.name}{course.code ? ` (${course.code})` : ''}
                              </span>
                            ))}
                            {dept.courses.length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{dept.courses.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="space-y-1 text-sm text-gray-600">
                        {dept.head && <p><span className="font-medium">Head:</span> {dept.head}</p>}
                        {(dept.contactInfo || dept.email) && <p><span className="font-medium">Contact:</span> {dept.contactInfo || dept.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{dept.studentCount ?? dept.student_count ?? 0}</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors"
                          onClick={() => handleViewTheses(dept)} title="Click to view theses">
                          {dept.thesisCount ?? dept.thesis_count ?? (dept.theses ? dept.theses.length : 0)}
                        </div>
                        <div className="text-xs text-gray-600">Theses</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="flex items-center gap-1 flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="flex items-center gap-1 flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />

      {/* Add Department Modal */}
      {showAddModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  Add New Department
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDepartment(null);
                  }}
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#6b7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Enter department name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Course *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., BSCS, BSIT"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                    placeholder="Enter department description"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Department Head *
                    </label>
                    <input
                      type="text"
                      name="head"
                      value={formData.head}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Dr. John Smith"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Contact Information
                    </label>
                    <input
                      type="email"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder="e.g., cs@faith.edu.ph"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label style={{ fontSize: '14px', color: '#374151' }}>
                    Active Department
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingDepartment(null);
                    }}
                    style={{
                      padding: '8px 16px',
                      color: '#374151',
                      backgroundColor: '#e5e7eb',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckIcon style={{ width: '16px', height: '16px' }} />
                    Add Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Department
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDepartment(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., BSCS, BSIT"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Head *
                    </label>
                    <input
                      type="text"
                      name="head"
                      value={formData.head}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Dr. John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Information
                    </label>
                    <input
                      type="email"
                      name="contactInfo"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder="e.g., cs@faith.edu.ph"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active Department
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDepartment(null);
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
                    Update Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Theses Modal */}
      {showThesesModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Theses - {selectedDepartment.name}
                </h2>
                <button
                  onClick={() => {
                    setShowThesesModal(false);
                    setSelectedDepartment(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Total: {selectedDepartment.theses ? selectedDepartment.theses.length : 0} theses
                </p>
              </div>

              <div className="space-y-3">
                {!selectedDepartment.theses || selectedDepartment.theses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No theses found for this department.
                  </div>
                ) : (
                  selectedDepartment.theses.map((thesis) => (
                    <div
                      key={thesis.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {thesis.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          thesis.status === 'Published' ? 'bg-green-100 text-green-800'
                            : thesis.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800'
                            : thesis.status === 'Approved' ? 'bg-blue-100 text-blue-800'
                            : thesis.status === 'Draft' ? 'bg-gray-200 text-gray-700'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {thesis.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="font-medium">Authors:</span> {Array.isArray(thesis.authors)
                          ? thesis.authors.map(author => `${author.firstName || ''} ${author.lastName || ''}`.trim()).filter(Boolean).join(', ')
                          : thesis.author || 'N/A'}</p>
                        {thesis.adviser && <p><span className="font-medium">Adviser:</span> {thesis.adviser.firstName ? `${thesis.adviser.firstName} ${thesis.adviser.lastName}` : thesis.adviser}</p>}
                        <p><span className="font-medium">Academic Year:</span> {thesis.academic_year || thesis.academicYear || 'N/A'}</p>
                        <p><span className="font-medium">Semester:</span> {thesis.semester || 'N/A'}</p>
                        <p><span className="font-medium">Category:</span> {thesis.category || 'N/A'}</p>
                        <p><span className="font-medium">Submitted:</span> {thesis.submitted_at || thesis.submittedAt ? new Date(thesis.submitted_at || thesis.submittedAt).toLocaleDateString() : 'Not submitted'}</p>
                      </div>
                      {thesis.published_at && (
                        <div className="mt-2 text-sm text-green-700">
                          <span className="font-medium">Published:</span> {new Date(thesis.published_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDepartments;
