import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
// In Vite, use import.meta.env for environment variables.
// Prefer relative "/api" to use the dev proxy (see vite.config.js)
const api = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api',
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
    // Don't redirect on login/register/auth errors - let the components handle them
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || 
                          error.config?.url?.includes('/auth/register') ||
                          error.config?.url?.includes('/auth/me');
    
    // Don't redirect immediately after login (give it time to process)
    const justLoggedIn = sessionStorage.getItem('justLoggedIn') === 'true';
    
    // Handle network errors (backend not running)
    if (!error.response && error.request) {
      console.error('Network Error: Backend server is not responding.');
      const backendUrl = api.defaults.baseURL || import.meta.env?.VITE_API_URL || '/api';
      console.error(`Backend URL: ${backendUrl}`);
      console.error('Possible causes:');
      console.error('1. Backend service is not running');
      console.error('2. Backend URL is incorrect');
      console.error('3. Network connectivity issue');
      console.error('4. CORS configuration issue');
      // Don't show toast for network errors to avoid spam, let components handle it
    }
    
    if (error.response?.status === 401 && !isAuthEndpoint && !justLoggedIn) {
      // Only redirect if not already on login page and not during login/register
      if (!window.location.pathname.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
        toast.error('Session expired. Please login again.');
      }
    }
    
    // Clear the justLoggedIn flag after a delay
    if (justLoggedIn) {
      setTimeout(() => sessionStorage.removeItem('justLoggedIn'), 5000);
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
  createUser: (userData) => api.post('/users', userData),
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
  approveUser: (id) => api.put(`/users/${id}/approve`),
  rejectUser: (id) => api.put(`/users/${id}/reject`),
};

// Thesis API
export const thesisAPI = {
  getTheses: (params) => api.get('/thesis', { params }),
  getThesis: (id) => api.get(`/thesis/${id}`),
  createThesis: (thesisData) => api.post('/thesis', thesisData),
  updateThesis: (id, thesisData) => api.put(`/thesis/${id}`, thesisData),
  deleteThesis: (id) => api.delete(`/thesis/${id}`),
  uploadDocument: (id, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('thesisDocument', file);
    return api.post(`/thesis/${id}/document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress || (() => {}), // Objective 4.3, 4.5: Progress tracking
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
  downloadDocument: (id) => api.get(`/thesis/${id}/download`, { responseType: 'blob' }),
  getDocumentUrl: (id) => {
    // Get the base URL - check environment variable first, then API instance default
    // In production (Vercel), VITE_API_URL should point to the backend URL (e.g., Render)
    // In development, it uses the proxy from vite.config.js
    const baseURL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
      ? import.meta.env.VITE_API_URL 
      : (api.defaults.baseURL || '/api');
    // Return the URL - token will be added in query params for iframe viewing
    // The backend's optionalAuth middleware will check both headers and query params
    return `${baseURL}/thesis/${id}/view`;
  },
  getMyTheses: () => api.get('/thesis/user/my-theses'),
  getAdviserDepartmentTheses: (params) => api.get('/thesis/adviser/department-theses', { params }),
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

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: () => api.get('/dashboard/activity'),
  getMyTheses: (limit) => api.get('/dashboard/my-theses', { params: { limit } }),
  getUpcomingEvents: (limit) => api.get('/dashboard/upcoming-events', { params: { limit } }),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (params) => api.get('/admin/analytics', { params }),
  reviewThesis: (id, reviewData) => api.put(`/admin/thesis/${id}/review`, reviewData),
  getTheses: (params) => api.get('/admin/thesis', { params }), // Get all theses (admin only)
  getPendingTheses: (params) => api.get('/admin/thesis/pending', { params }),
  bulkOperation: (operation, ids) => api.post('/admin/bulk', { operation, ids }),
  
  // Department management
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (departmentData) => api.post('/admin/departments', departmentData),
  updateDepartment: (id, departmentData) => api.put(`/admin/departments/${id}`, departmentData),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
};

// Courses API
export const coursesAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};

// Departments API (public access for authenticated users)
export const departmentsAPI = {
  getDepartments: () => api.get('/dashboard/departments'), // Accessible to all authenticated users
  getDepartment: (id) => api.get(`/admin/departments/${id}`), // Admin only for individual dept
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
