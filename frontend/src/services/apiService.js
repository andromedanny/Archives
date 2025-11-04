// API service for dashboard and other components
// Simple configuration - change this URL based on your backend server
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  }

  // Dashboard API calls
  async getDashboardStats() {
    // Use mock data for testing - change back to /stats when auth is working
    const response = await fetch(`${this.baseURL}/dashboard/mock-stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getRecentActivity() {
    // Use mock data for testing - change back to /activity when auth is working
    const response = await fetch(`${this.baseURL}/dashboard/mock-activity`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getMyTheses(limit = 5) {
    // Use mock data for testing - change back to /my-theses when auth is working
    const response = await fetch(`${this.baseURL}/dashboard/mock-my-theses?limit=${limit}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getUpcomingEvents(limit = 5) {
    // Use mock data for testing - change back to /upcoming-events when auth is working
    const response = await fetch(`${this.baseURL}/dashboard/mock-upcoming-events?limit=${limit}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getDepartmentStats() {
    // Use mock data for testing - change back to /department-stats when auth is working
    const response = await fetch(`${this.baseURL}/dashboard/mock-department-stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Thesis API calls
  async getTheses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/thesis?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getThesisById(id) {
    const response = await fetch(`${this.baseURL}/thesis/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createThesis(thesisData) {
    const response = await fetch(`${this.baseURL}/thesis`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(thesisData)
    });
    return this.handleResponse(response);
  }

  async updateThesis(id, thesisData) {
    const response = await fetch(`${this.baseURL}/thesis/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(thesisData)
    });
    return this.handleResponse(response);
  }

  async deleteThesis(id) {
    const response = await fetch(`${this.baseURL}/thesis/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async downloadThesis(id) {
    const response = await fetch(`${this.baseURL}/thesis/${id}/download`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    return response.blob();
  }

  // User API calls
  async getUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/users?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserById(id) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfile(userData) {
    const response = await fetch(`${this.baseURL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  // Calendar API calls
  async getCalendarEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/calendar?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createCalendarEvent(eventData) {
    const response = await fetch(`${this.baseURL}/calendar`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(eventData)
    });
    return this.handleResponse(response);
  }

  async updateCalendarEvent(id, eventData) {
    const response = await fetch(`${this.baseURL}/calendar/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(eventData)
    });
    return this.handleResponse(response);
  }

  async deleteCalendarEvent(id) {
    const response = await fetch(`${this.baseURL}/calendar/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Admin API calls
  async getAdminStats() {
    const response = await fetch(`${this.baseURL}/admin/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminTheses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/theses?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/users?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getDepartments() {
    const response = await fetch(`${this.baseURL}/admin/departments`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createDepartment(departmentData) {
    const response = await fetch(`${this.baseURL}/admin/departments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(departmentData)
    });
    return this.handleResponse(response);
  }

  async updateDepartment(id, departmentData) {
    const response = await fetch(`${this.baseURL}/admin/departments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(departmentData)
    });
    return this.handleResponse(response);
  }

  async deleteDepartment(id) {
    const response = await fetch(`${this.baseURL}/admin/departments/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Analytics API calls
  async getAnalytics(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/analytics?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // File upload
  async uploadFile(file, type = 'thesis') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Search functionality
  async searchTheses(query, filters = {}) {
    const searchParams = new URLSearchParams({
      q: query,
      ...filters
    }).toString();
    
    const response = await fetch(`${this.baseURL}/thesis/search?${searchParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Notification system
  async getNotifications() {
    const response = await fetch(`${this.baseURL}/notifications`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async markNotificationAsRead(id) {
    const response = await fetch(`${this.baseURL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
