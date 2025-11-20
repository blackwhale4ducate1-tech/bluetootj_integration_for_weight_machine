import apiClient, { apiCall } from './axiosConfig';

/**
 * Authentication API functions
 */

// User registration
export const registerUser = async (userData) => {
  return apiCall(async () => {
    const response = await apiClient.post('/auth/register', {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      height: userData.height,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    });
    
    return response.data;
  });
};

// User login
export const loginUser = async (email, password) => {
  return apiCall(async () => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    return response.data;
  });
};

// Get user profile
export const getUserProfile = async () => {
  return apiCall(async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  });
};

// Update user profile
export const updateUserProfile = async (userData) => {
  return apiCall(async () => {
    const response = await apiClient.put('/auth/profile', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      height: userData.height,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    });
    
    return response.data;
  });
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  return apiCall(async () => {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    return response.data;
  });
};

// Logout user
export const logoutUser = async () => {
  return apiCall(async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  });
};

// Forgot password (if implemented in backend)
export const forgotPassword = async (email) => {
  return apiCall(async () => {
    const response = await apiClient.post('/auth/forgot-password', {
      email,
    });
    
    return response.data;
  });
};

// Reset password (if implemented in backend)
export const resetPassword = async (token, newPassword) => {
  return apiCall(async () => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    
    return response.data;
  });
};

export default {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  logoutUser,
  forgotPassword,
  resetPassword,
};
