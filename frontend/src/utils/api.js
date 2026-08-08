import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from localStorage on every request if available
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('taskmanager_user');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    } catch {
      // ignore
    }
  }
  return config;
});

// Normalize error responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
