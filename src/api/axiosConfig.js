import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in development
      if (__DEV__) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          headers: config.headers,
        });
      }
      
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (__DEV__) {
      console.log('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    
    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              await AsyncStorage.multiRemove([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_DATA,
              ]);
              
              // You can emit an event here to trigger navigation to login
              // or use a navigation service
              console.log('Token expired, user logged out');
              
            } catch (storageError) {
              console.error('Error clearing storage:', storageError);
            }
          }
          
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.AUTH.TOKEN_EXPIRED,
          });
          
        case 400:
          // Bad Request - validation errors
          return Promise.reject({
            ...error,
            message: data?.message || 'Invalid request data',
            errors: data?.errors || [],
          });
          
        case 403:
          // Forbidden
          return Promise.reject({
            ...error,
            message: data?.message || 'Access denied',
          });
          
        case 404:
          // Not Found
          return Promise.reject({
            ...error,
            message: data?.message || 'Resource not found',
          });
          
        case 409:
          // Conflict
          return Promise.reject({
            ...error,
            message: data?.message || 'Resource already exists',
          });
          
        case 422:
          // Unprocessable Entity - validation errors
          return Promise.reject({
            ...error,
            message: data?.message || 'Validation failed',
            errors: data?.errors || [],
          });
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.NETWORK.SERVER_ERROR,
          });
          
        default:
          return Promise.reject({
            ...error,
            message: data?.message || ERROR_MESSAGES.NETWORK.UNKNOWN,
          });
      }
    } else if (error.request) {
      // Network error
      if (error.code === 'ECONNABORTED') {
        return Promise.reject({
          ...error,
          message: ERROR_MESSAGES.NETWORK.TIMEOUT,
        });
      } else {
        return Promise.reject({
          ...error,
          message: ERROR_MESSAGES.NETWORK.NO_CONNECTION,
        });
      }
    } else {
      // Something else happened
      return Promise.reject({
        ...error,
        message: ERROR_MESSAGES.NETWORK.UNKNOWN,
      });
    }
  }
);

// Helper function to handle API calls with retry logic
export const apiCall = async (requestFn, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && shouldRetry(error)) {
      console.log(`Retrying API call, ${retries} attempts left`);
      await delay(API_CONFIG.RETRY_DELAY);
      return apiCall(requestFn, retries - 1);
    }
    throw error;
  }
};

// Helper function to determine if request should be retried
const shouldRetry = (error) => {
  // Retry on network errors or 5xx server errors
  return (
    !error.response ||
    error.code === 'ECONNABORTED' ||
    (error.response.status >= 500 && error.response.status < 600)
  );
};

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Helper function to get current user data
export const getCurrentUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper function to clear authentication data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

export default apiClient;
