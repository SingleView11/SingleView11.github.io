import axios from 'axios';
import authService from './authService';

// Base URL for your backend
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default config
const trainingAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
trainingAPI.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    console.log('TrainingAPI request interceptor - token exists:', !!token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header to request');
    } else {
      console.warn('No token found for request');
    }
    return config;
  },
  (error) => {
    console.error('TrainingAPI request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to better handle errors
trainingAPI.interceptors.response.use(
  (response) => {
    console.log('TrainingAPI successful response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('TrainingAPI error response:', error.response?.status, error.response?.data);
    console.error('Full error object:', error);
    return Promise.reject(error);
  }
);

// Training service for saving results and fetching analytics
export const trainingService = {
  // Test authentication and basic connectivity
  testConnection: async () => {
    try {
      console.log('Testing connection to training API...');
      
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated');
        return { authenticated: false };
      }

      console.log('Making test request to /api/training/stats');
      const response = await trainingAPI.get('/api/training/stats');
      console.log('Test connection successful:', response.data);
      return { authenticated: true, data: response.data };
    } catch (error) {
      console.error('Test connection failed:', error);
      console.error('Test error response:', error.response?.data);
      console.error('Test error status:', error.response?.status);
      return { authenticated: true, error: error.response?.data || error.message };
    }
  },
  // Save training session result
  saveTrainingSession: async (sessionData) => {
    try {
      // Only save if user is authenticated
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, skipping training data save');
        return null;
      }

      const response = await trainingAPI.post('/api/training/session', sessionData);
      return response.data;
    } catch (error) {
      console.error('Failed to save training session:', error);
      throw error.response?.data || { message: 'Failed to save training session' };
    }
  },

  // Save individual training record
  saveTrainingRecord: async (recordData) => {
    try {
      console.log('trainingService.saveTrainingRecord called with:', recordData);
      
      // Only save if user is authenticated
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, skipping training record save');
        return null;
      }

      console.log('Making POST request to /api/training/record');
      const response = await trainingAPI.post('/api/training/record', recordData);
      console.log('Save training record response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to save training record:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error.response?.data || { message: 'Failed to save training record' };
    }
  },

  // Get user analytics
  getUserAnalytics: async () => {
    try {
      console.log('trainingService.getUserAnalytics called');
      
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, returning null for analytics');
        return null;
      }

      console.log('Making GET request to /api/training/analytics');
      const response = await trainingAPI.get('/api/training/analytics');
      console.log('Get analytics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get user analytics:', error);
      console.error('Analytics error response:', error.response?.data);
      console.error('Analytics error status:', error.response?.status);
      throw error.response?.data || { message: 'Failed to get analytics' };
    }
  },

  // Get recent training history
  getRecentTraining: async (limit = 10) => {
    try {
      if (!authService.isAuthenticated()) {
        return [];
      }

      const response = await trainingAPI.get(`/api/training/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get recent training:', error);
      throw error.response?.data || { message: 'Failed to get recent training' };
    }
  },

  // Get training statistics
  getTrainingStats: async () => {
    try {
      console.log('trainingService.getTrainingStats called');
      
      if (!authService.isAuthenticated()) {
        console.log('User not authenticated, returning null for stats');
        return null;
      }

      console.log('Making GET request to /api/training/stats');
      const response = await trainingAPI.get('/api/training/stats');
      console.log('Get stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get training stats:', error);
      console.error('Stats error response:', error.response?.data);
      console.error('Stats error status:', error.response?.status);
      throw error.response?.data || { message: 'Failed to get training stats' };
    }
  },

  // Get session summaries
  getSessionSummaries: async (limit = 10) => {
    try {
      if (!authService.isAuthenticated()) {
        return [];
      }

      const response = await trainingAPI.get(`/api/training/sessions?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session summaries:', error);
      throw error.response?.data || { message: 'Failed to get session summaries' };
    }
  },

  // Get element accuracy (for specific training types)
  getElementAccuracy: async (trainingType) => {
    try {
      if (!authService.isAuthenticated()) {
        return {};
      }

      const response = await trainingAPI.get(`/api/training/accuracy/${trainingType}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get element accuracy:', error);
      throw error.response?.data || { message: 'Failed to get element accuracy' };
    }
  },
};

export default trainingService;
