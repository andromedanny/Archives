import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';
import { usersAPI, departmentsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    isActive: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailManuallyEdited, setEmailManuallyEdited] = useState(false);

  // Check URL parameter to open add modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowAddModal(true);
      // Remove the query parameter from URL
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getUsers();
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      if (error.response?.status !== 401) {
        toast.error('Failed to load users');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

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

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // Don't populate password when editing
      role: user.role,
      department: user.department,
      isActive: user.isActive
    });
    setShowPassword(false);
    setEmailManuallyEdited(true);
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'student',
      department: '',
      isActive: true
    });
    setShowPassword(false);
    setEmailManuallyEdited(false);
    setShowAddModal(true);
  };

  // Generate email suggestion from first name and last name
  const generateEmailSuggestion = (firstName, lastName, role) => {
    if (!firstName || !lastName) return '';
    
    // Get first letter of first name (lowercase)
    const firstInitial = firstName.charAt(0).toLowerCase();
    
    // Get last name, remove spaces, convert to lowercase
    const lastPart = lastName.replace(/\s+/g, '').toLowerCase();
    
    // Combine: firstInitial + lastPart
    const emailLocal = `${firstInitial}${lastPart}`;
    
    // Suggest firstasia.edu.ph for students, gmail.com for others
    const domain = role === 'student' ? 'firstasia.edu.ph' : 'gmail.com';
    return `${emailLocal}@${domain}`;
  };

  // Handle input change with email auto-suggestion
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Track if email is manually edited
    if (name === 'email') {
      setEmailManuallyEdited(true);
      // Just update formData without changing email suggestion
      setFormData(newFormData);
      return;
    }

    // If firstName or lastName changes, update email suggestion (only if email hasn't been manually edited)
    if (!emailManuallyEdited && (name === 'firstName' || name === 'lastName')) {
      // newFormData already has the updated value for the field being changed
      if (newFormData.firstName && newFormData.lastName) {
        newFormData.email = generateEmailSuggestion(newFormData.firstName, newFormData.lastName, newFormData.role);
      } else {
        // Clear email if either name is empty
        newFormData.email = '';
      }
    }

    // If role changes, update email suggestion if both names exist and email hasn't been manually edited
    if (!emailManuallyEdited && name === 'role' && newFormData.firstName && newFormData.lastName) {
      newFormData.email = generateEmailSuggestion(newFormData.firstName, newFormData.lastName, value);
    }

    setFormData(newFormData);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        // Update existing user - only include password if provided
        const updateData = { ...formData };
        if (updateData.password && updateData.password.trim() !== '') {
          // If password is provided, validate it
          if (updateData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
          }
          // Password will be included in updateData
        } else {
          // Remove password from updateData if empty
          delete updateData.password;
        }
        await usersAPI.updateUser(editingUser.id, updateData);
        toast.success('User updated successfully');
        setShowEditModal(false);
        fetchUsers();
      } else {
        // Add new user - password is required
        if (!formData.password || formData.password.trim() === '') {
          toast.error('Password is required');
          return;
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          return;
        }
        await usersAPI.createUser(formData);
        toast.success('User created successfully');
        setShowAddModal(false);
        fetchUsers();
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'student',
        department: '',
        isActive: true
      });
      setShowPassword(false);
      setEmailManuallyEdited(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (userId, forceDelete = false) => {
    const user = users.find(u => u.id === userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'this user';
    
    let confirmMessage = `Are you sure you want to delete ${userName}?`;
    if (forceDelete) {
      confirmMessage = `Are you sure you want to delete ${userName} and ALL their uploaded theses? This action cannot be undone.`;
    }
    
    if (window.confirm(confirmMessage)) {
      try {
        const url = forceDelete ? `${userId}?force=true` : userId;
        await usersAPI.deleteUser(url);
        toast.success(forceDelete ? 'User and their theses deleted successfully' : 'User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error.response?.data?.message || 'Failed to delete user';
        const errorData = error.response?.data;
        
        // Show error with detailed message and offer force delete option
        if (error.response?.status === 400 && (errorMessage.includes('thesis') || errorMessage.includes('adviser')) && errorData?.canForceDelete) {
          const confirmMessage = errorMessage.includes('adviser') 
            ? `${errorMessage}\n\nWould you like to delete this user and remove them as adviser from all theses?`
            : `${errorMessage}\n\nWould you like to delete this user and all their theses?`;
          
          const shouldForceDelete = window.confirm(confirmMessage);
          
          if (shouldForceDelete) {
            handleDelete(userId, true);
          }
        } else {
          toast.error(errorMessage, {
            duration: 6000,
            style: {
              maxWidth: '500px',
              whiteSpace: 'pre-wrap'
            }
          });
        }
      }
    }
  };



  return (
    <>
      <Helmet>
        <title>Admin Users - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Manage system users" />
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
              <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
              <button 
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add New User
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No users found</p>
                <button 
                  onClick={handleAddNew}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First User
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.email}</td>
                        <td className="px-4 py-3 text-sm border-b">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'faculty'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.department}</td>
                        <td className="px-4 py-3 text-sm border-b">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              <PencilIcon className="h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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

      {/* Add User Modal */}
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
                  Add New User
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="adviser">Adviser</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="Email will be auto-suggested"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        paddingRight: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="Enter password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeSlashIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      ) : (
                        <EyeIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Department</option>
                    {departments.filter(d => d.is_active).map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
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
                    Active User
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingUser(null);
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
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
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
                  Edit User
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
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
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="adviser">Adviser</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
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
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
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
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
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
                    Password {editingUser ? '(Leave blank to keep current password)' : '*'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                      minLength={editingUser ? 0 : 6}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        paddingRight: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder={editingUser ? 'Leave blank to keep current password' : 'Enter password (min. 6 characters)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeSlashIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      ) : (
                        <EyeIcon style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                      )}
                    </button>
                  </div>
                  {!editingUser && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Password must be at least 6 characters long
                    </p>
                  )}
                  {editingUser && (
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Leave blank to keep current password, or enter new password (min. 6 characters)
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Department *
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
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
                    Active User
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '16px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingUser(null);
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
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
