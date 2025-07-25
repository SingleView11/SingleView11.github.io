import axios from 'axios';

// Base URL for your backend - use environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth service for login/register (REST endpoints)
export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await authAPI.post('/auth/register', userData);
      
      // Store JWT token in localStorage with consistent keys
      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('token', response.data.token); // Also store with 'token' key for consistency
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/auth/login', credentials);
      
      // Store JWT token in localStorage with consistent keys
      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        localStorage.setItem('token', response.data.token); // Also store with 'token' key for consistency
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // OAuth2 Google login
  loginWithGoogle: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  },

  // Handle OAuth2 redirect
  handleOAuth2Redirect: (token) => {
    if (token) {
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('token', token);
      
      // Decode JWT to get user info (basic decode, not verification)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          username: payload.sub,
          email: payload.sub,
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    return null;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },

  // Get JWT token
  getToken: () => {
    return localStorage.getItem('jwtToken') || localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
    return !!token;
  },

  // Get user profile (for checking if token is still valid)
  getProfile: async () => {
    try {
      const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      const response = await authAPI.get('/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },
};

export default authService;
