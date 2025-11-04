import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackgroundImage from '../../components/UI/BackgroundImage';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Student',
        department: 'Computer Science',
        joinDate: '2023-01-15',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'Faculty',
        department: 'Information Technology',
        joinDate: '2022-08-20',
        status: 'Active'
      },
      {
        id: 3,
        name: 'Dr. Alice Johnson',
        email: 'alice.johnson@example.com',
        role: 'Admin',
        department: 'Entertainment and Multimedia Computing',
        joinDate: '2021-06-10',
        status: 'Active'
      }
    ];
    
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const handleEdit = (userId) => {
    // Navigate to edit user page
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Handle deletion
      console.log('Delete user:', userId);
    }
  };

  return (
    <>
      <Helmet>
        <title>Users - FAITH Colleges Thesis Archive</title>
        <meta name="description" content="Manage system users" />
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
              <h1 className="text-3xl font-bold text-gray-800">Users</h1>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add New User
              </button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Join Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
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
                        <td className="px-4 py-3 text-sm text-gray-900 border-b">{user.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.role}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">{user.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-b">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm border-b">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
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
    </>
  );
};

export default Users;
