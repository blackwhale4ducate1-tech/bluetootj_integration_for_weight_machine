import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  logoutUser 
} from '../api/authApi';
import StorageService from '../services/StorageService';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  RESTORE_AUTH: 'RESTORE_AUTH',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };

    case AUTH_ACTIONS.RESTORE_AUTH:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from storage on app start
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const [token, userData] = await Promise.all([
        StorageService.getToken(),
        StorageService.getUser(),
      ]);

      if (token && userData) {
        // Verify token is still valid by fetching user profile
        try {
          const response = await getUserProfile();
          if (response.success) {
            dispatch({
              type: AUTH_ACTIONS.RESTORE_AUTH,
              payload: {
                user: response.data,
                token,
              },
            });
            // Update stored user data with latest from server
            await StorageService.saveUser(response.data);
            return;
          }
        } catch (error) {
          console.log('Token validation failed:', error.message);
          // Token is invalid, clear stored data
          await StorageService.clearAuthData();
        }
      }

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      console.error('Error loading user from storage:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await registerUser(userData);

      if (response.success) {
        const { user, token } = response.data;

        // Save to storage
        await Promise.all([
          StorageService.saveToken(token),
          StorageService.saveUser(user),
        ]);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        return { success: true, message: SUCCESS_MESSAGES.AUTH.REGISTRATION };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await loginUser(email, password);

      if (response.success) {
        const { user, token } = response.data;

        // Save to storage
        await Promise.all([
          StorageService.saveToken(token),
          StorageService.saveUser(user),
        ]);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        return { success: true, message: SUCCESS_MESSAGES.AUTH.LOGIN };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS;
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout API (optional, for server-side token invalidation)
      try {
        await logoutUser();
      } catch (error) {
        console.log('Logout API call failed:', error.message);
        // Continue with local logout even if API call fails
      }

      // Clear storage
      await StorageService.clearAuthData();

      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      return { success: true, message: SUCCESS_MESSAGES.AUTH.LOGOUT };
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if there's an error
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true, message: SUCCESS_MESSAGES.AUTH.LOGOUT };
    }
  };

  const updateProfile = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await updateUserProfile(userData);

      if (response.success) {
        const updatedUser = response.data;

        // Update storage
        await StorageService.saveUser(updatedUser);

        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });

        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });

        return { success: true, message: SUCCESS_MESSAGES.AUTH.PROFILE_UPDATED };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await changePassword(currentPassword, newPassword);

      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true, message: SUCCESS_MESSAGES.AUTH.PASSWORD_CHANGED };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await getUserProfile();
      if (response.success) {
        const updatedUser = response.data;
        await StorageService.saveUser(updatedUser);
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      return { success: false, message: error.message };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    refreshProfile,
    clearError,
    loadUserFromStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
