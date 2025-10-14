import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

// Users API
export const usersAPI = {
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  uploadAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getUserStats: (id) => api.get(`/users/${id}/stats`),
  getFaculty: () => api.get('/users/faculty/list'),
  getUsersByDepartment: (department) => api.get(`/users/department/${department}`),
};

// Thesis API
export const thesisAPI = {
  getTheses: (params) => api.get('/thesis', { params }),
  getThesis: (id) => api.get(`/thesis/${id}`),
  createThesis: (thesisData) => api.post('/thesis', thesisData),
  updateThesis: (id, thesisData) => api.put(`/thesis/${id}`, thesisData),
  deleteThesis: (id) => api.delete(`/thesis/${id}`),
  uploadDocument: (id, file) => {
    const formData = new FormData();
    formData.append('thesisDocument', file);
    return api.post(`/thesis/${id}/document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadSupplementaryFiles: (id, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('supplementaryFiles', file));
    return api.post(`/thesis/${id}/supplementary`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submitThesis: (id) => api.put(`/thesis/${id}/submit`),
  downloadThesis: (id) => api.get(`/thesis/${id}/download`, { responseType: 'blob' }),
  getMyTheses: () => api.get('/thesis/user/my-theses'),
  searchTheses: (query, filters) => api.get('/thesis', { params: { search: query, ...filters } }),
};

// Calendar API
export const calendarAPI = {
  getEvents: (params) => api.get('/calendar', { params }),
  getEvent: (id) => api.get(`/calendar/${id}`),
  createEvent: (eventData) => api.post('/calendar', eventData),
  updateEvent: (id, eventData) => api.put(`/calendar/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/calendar/${id}`),
  respondToEvent: (id, status) => api.put(`/calendar/${id}/respond`, { status }),
  uploadAttachments: (id, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('calendarAttachments', file));
    return api.post(`/calendar/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getUpcomingEvents: (limit, department) => api.get('/calendar/upcoming', { 
    params: { limit, department } 
  }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  reviewThesis: (id, reviewData) => api.put(`/admin/thesis/${id}/review`, reviewData),
  getPendingTheses: (params) => api.get('/admin/thesis/pending', { params }),
  bulkOperation: (operation, ids) => api.post('/admin/bulk', { operation, ids }),
  
  // Department management
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (departmentData) => api.post('/admin/departments', departmentData),
  updateDepartment: (id, departmentData) => api.put(`/admin/departments/${id}`, departmentData),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
};

// File upload helper
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    toast.error(message);
    return message;
  } else if (error.request) {
    // Request was made but no response received
    toast.error('Network error. Please check your connection.');
    return 'Network error';
  } else {
    // Something else happened
    toast.error('An unexpected error occurred');
    return 'Unexpected error';
  }
};

export default api;
