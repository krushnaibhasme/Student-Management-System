/**
 * API Service for communicating with Express Backend
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Remove any trailing slash for consistent route concatenation
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

/**
 * Generic helper to execute fetch requests with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        data?.message ||
        (data?.errors && data.errors.join(', ')) ||
        `Request failed with status ${response.status} (${response.statusText})`;
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to the backend server. Please verify the backend is running and CORS is configured.'
      );
    }
    throw error;
  }
};

export const studentApi = {
  /**
   * Check backend server health
   */
  checkHealth: async () => {
    try {
      const baseUrlWithoutApi = API_BASE_URL.replace(/\/api$/, '');
      const response = await fetch(`${baseUrlWithoutApi}/api/health`);
      if (!response.ok) return false;
      const data = await response.json();
      return data?.status === 'healthy';
    } catch {
      return false;
    }
  },

  /**
   * Fetch all students with optional search & filters
   */
  getStudents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.year && params.year !== 'All') query.append('year', params.year);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;
    return await request(endpoint, { method: 'GET' });
  },

  /**
   * Fetch a single student by MongoDB ID
   */
  getStudentById: async (id) => {
    return await request(`/students/${id}`, { method: 'GET' });
  },

  /**
   * Create a new student
   */
  createStudent: async (studentData) => {
    return await request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    });
  },

  /**
   * Update an existing student
   */
  updateStudent: async (id, studentData) => {
    return await request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    });
  },

  /**
   * Delete a student
   */
  deleteStudent: async (id) => {
    return await request(`/students/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Fetch dashboard statistics
   */
  getStats: async () => {
    return await request('/students/stats', { method: 'GET' });
  }
};

export default studentApi;
