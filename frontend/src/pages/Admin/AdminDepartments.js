import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { 
  PencilIcon, 
  TrashIcon, 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminDepartments = () => {
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

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockDepartments = [
      {
        id: 1,
        name: 'Computer Science',
        code: 'BSCS',
        description: 'Bachelor of Science in Computer Science',
        head: 'Dr. John Smith',
        contactInfo: 'cs@faith.edu.ph',
        studentCount: 150,
        thesisCount: 45,
        isActive: true,
        theses: [
          {
            id: 1,
            title: 'Web-Based Learning Management System',
            author: 'Alice Brown',
            adviser: 'Dr. John Smith',
            status: 'Published',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: '2024-05-01',
            publishedAt: '2024-06-15'
          },
          {
            id: 2,
            title: 'Mobile Application for Student Information System',
            author: 'Charlie Davis',
            adviser: 'Dr. John Smith',
            status: 'Under Review',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: '2024-05-15',
            publishedAt: null
          },
          {
            id: 3,
            title: 'AI-Powered Grade Prediction System',
            author: 'Eve Wilson',
            adviser: 'Dr. John Smith',
            status: 'Approved',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: '2024-04-20',
            publishedAt: null
          }
        ]
      },
      {
        id: 2,
        name: 'Information Technology',
        code: 'BSIT',
        description: 'Bachelor of Science in Information Technology',
        head: 'Dr. Jane Doe',
        contactInfo: 'it@faith.edu.ph',
        studentCount: 120,
        thesisCount: 38,
        isActive: true,
        theses: [
          {
            id: 4,
            title: 'E-Commerce Platform for Small Businesses',
            author: 'Bob Wilson',
            adviser: 'Dr. Jane Doe',
            status: 'Published',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: '2024-05-05',
            publishedAt: '2024-06-20'
          },
          {
            id: 5,
            title: 'IoT-Based Smart Home Automation System',
            author: 'David Lee',
            adviser: 'Dr. Jane Doe',
            status: 'Draft',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: null,
            publishedAt: null
          }
        ]
      },
      {
        id: 3,
        name: 'Entertainment and Multimedia Computing',
        code: 'BSEMC',
        description: 'Bachelor of Science in Entertainment and Multimedia Computing',
        head: 'Dr. Alice Johnson',
        contactInfo: 'emc@faith.edu.ph',
        studentCount: 80,
        thesisCount: 25,
        isActive: true,
        theses: [
          {
            id: 6,
            title: '3D Animation System for Educational Content',
            author: 'Frank Miller',
            adviser: 'Dr. Alice Johnson',
            status: 'Published',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: '2024-04-30',
            publishedAt: '2024-06-10'
          }
        ]
      },
      {
        id: 4,
        name: 'Information Systems',
        code: 'BSIS',
        description: 'Bachelor of Science in Information Systems',
        head: 'Dr. Bob Wilson',
        contactInfo: 'is@faith.edu.ph',
        studentCount: 60,
        thesisCount: 18,
        isActive: false,
        theses: [
          {
            id: 7,
            title: 'Digital Marketing Strategies for Educational Institutions',
            author: 'Carol Davis',
            adviser: 'Dr. Bob Wilson',
            status: 'Under Review',
            academicYear: '2023-2024',
            semester: '2nd Semester',
            category: 'Undergraduate',
            submittedAt: '2024-05-10',
            publishedAt: null
          }
        ]
      }
    ];
    
    setDepartments(mockDepartments);
    setIsLoading(false);
  }, []);

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description,
      head: department.head,
      contactInfo: department.contactInfo || '',
      isActive: department.isActive
    });
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    console.log('Add New Department clicked');
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
    console.log('showAddModal set to true');
  };

  const handleSave = () => {
    if (editingDepartment) {
      // Update existing department
      setDepartments(departments.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, ...formData }
          : dept
      ));
      setShowEditModal(false);
    } else {
      // Add new department
      const newDepartment = {
        id: departments.length + 1,
        ...formData,
        studentCount: 0,
        thesisCount: 0
      };
      setDepartments([...departments, newDepartment]);
      setShowAddModal(false);
    }
    setEditingDepartment(null);
  };

  const handleDelete = (deptId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== deptId));
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
                        <h3 className="text-xl font-semibold text-gray-800">{dept.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dept.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {dept.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Code: {dept.code}</p>
                      <p className="text-sm text-gray-600 mb-3">{dept.description}</p>
                      <p className="text-sm text-gray-600 mb-1">Head: {dept.head}</p>
                      <p className="text-sm text-gray-600">Contact: {dept.contactInfo}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{dept.studentCount}</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div className="text-center">
                        <div 
                          className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors"
                          onClick={() => handleViewTheses(dept)}
                          title="Click to view theses"
                        >
                          {dept.thesisCount}
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
      {console.log('showAddModal state:', showAddModal)}
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
                      Department Code *
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
                      Department Code *
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
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  Theses - {selectedDepartment.name}
                </h2>
                <button
                  onClick={() => {
                    setShowThesesModal(false);
                    setSelectedDepartment(null);
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

              <div style={{ marginBottom: '16px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Total: {selectedDepartment.theses.length} theses
                </p>
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {selectedDepartment.theses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    <p>No theses found for this department.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedDepartment.theses.map((thesis) => (
                      <div
                        key={thesis.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          backgroundColor: '#f9fafb'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {thesis.title}
                          </h3>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500',
                              backgroundColor: 
                                thesis.status === 'Published' ? '#dcfce7' :
                                thesis.status === 'Under Review' ? '#fef3c7' :
                                thesis.status === 'Approved' ? '#dbeafe' :
                                thesis.status === 'Draft' ? '#f3f4f6' : '#fee2e2',
                              color: 
                                thesis.status === 'Published' ? '#166534' :
                                thesis.status === 'Under Review' ? '#92400e' :
                                thesis.status === 'Approved' ? '#1e40af' :
                                thesis.status === 'Draft' ? '#374151' : '#991b1b'
                            }}
                          >
                            {thesis.status}
                          </span>
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                          <div>
                            <strong>Author:</strong> {thesis.author}
                          </div>
                          <div>
                            <strong>Adviser:</strong> {thesis.adviser}
                          </div>
                          <div>
                            <strong>Academic Year:</strong> {thesis.academicYear}
                          </div>
                          <div>
                            <strong>Semester:</strong> {thesis.semester}
                          </div>
                          <div>
                            <strong>Category:</strong> {thesis.category}
                          </div>
                          <div>
                            <strong>Submitted:</strong> {thesis.submittedAt ? new Date(thesis.submittedAt).toLocaleDateString() : 'Not submitted'}
                          </div>
                        </div>
                        
                        {thesis.publishedAt && (
                          <div style={{ marginTop: '8px', fontSize: '14px', color: '#059669' }}>
                            <strong>Published:</strong> {new Date(thesis.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
