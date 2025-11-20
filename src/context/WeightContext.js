import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  createMeasurement,
  getMeasurements,
  getLatestMeasurement,
  getMeasurementsByRange,
  getWeightStatistics,
  updateMeasurement,
  deleteMeasurement,
  getDashboardStats,
} from '../api/weightApi';
import StorageService from '../services/StorageService';
import { useAuth } from './AuthContext';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

// Initial state
const initialState = {
  measurements: [],
  latestMeasurement: null,
  statistics: null,
  dashboardStats: null,
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 0,
  refreshing: false,
  lastSync: null,
};

// Action types
const WEIGHT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_REFRESHING: 'SET_REFRESHING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_MEASUREMENTS: 'SET_MEASUREMENTS',
  ADD_MEASUREMENTS: 'ADD_MEASUREMENTS',
  ADD_MEASUREMENT: 'ADD_MEASUREMENT',
  UPDATE_MEASUREMENT: 'UPDATE_MEASUREMENT',
  REMOVE_MEASUREMENT: 'REMOVE_MEASUREMENT',
  SET_LATEST_MEASUREMENT: 'SET_LATEST_MEASUREMENT',
  SET_STATISTICS: 'SET_STATISTICS',
  SET_DASHBOARD_STATS: 'SET_DASHBOARD_STATS',
  SET_HAS_MORE: 'SET_HAS_MORE',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_LAST_SYNC: 'SET_LAST_SYNC',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const weightReducer = (state, action) => {
  switch (action.type) {
    case WEIGHT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };

    case WEIGHT_ACTIONS.SET_REFRESHING:
      return {
        ...state,
        refreshing: action.payload,
      };

    case WEIGHT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        refreshing: false,
      };

    case WEIGHT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case WEIGHT_ACTIONS.SET_MEASUREMENTS:
      return {
        ...state,
        measurements: action.payload,
        loading: false,
        refreshing: false,
        currentPage: 0,
      };

    case WEIGHT_ACTIONS.ADD_MEASUREMENTS:
      return {
        ...state,
        measurements: [...state.measurements, ...action.payload],
        loading: false,
        currentPage: state.currentPage + 1,
      };

    case WEIGHT_ACTIONS.ADD_MEASUREMENT:
      return {
        ...state,
        measurements: [action.payload, ...state.measurements],
        latestMeasurement: action.payload,
        loading: false,
      };

    case WEIGHT_ACTIONS.UPDATE_MEASUREMENT:
      const updatedMeasurements = state.measurements.map(measurement =>
        measurement.id === action.payload.id ? action.payload : measurement
      );
      
      return {
        ...state,
        measurements: updatedMeasurements,
        latestMeasurement: state.latestMeasurement?.id === action.payload.id 
          ? action.payload 
          : state.latestMeasurement,
        loading: false,
      };

    case WEIGHT_ACTIONS.REMOVE_MEASUREMENT:
      const filteredMeasurements = state.measurements.filter(
        measurement => measurement.id !== action.payload
      );
      
      return {
        ...state,
        measurements: filteredMeasurements,
        latestMeasurement: state.latestMeasurement?.id === action.payload 
          ? (filteredMeasurements[0] || null)
          : state.latestMeasurement,
        loading: false,
      };

    case WEIGHT_ACTIONS.SET_LATEST_MEASUREMENT:
      return {
        ...state,
        latestMeasurement: action.payload,
        loading: false,
      };

    case WEIGHT_ACTIONS.SET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
        loading: false,
      };

    case WEIGHT_ACTIONS.SET_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload,
        loading: false,
      };

    case WEIGHT_ACTIONS.SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload,
      };

    case WEIGHT_ACTIONS.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case WEIGHT_ACTIONS.SET_LAST_SYNC:
      return {
        ...state,
        lastSync: action.payload,
      };

    case WEIGHT_ACTIONS.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Create context
const WeightContext = createContext();

// Provider component
export const WeightProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weightReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cached data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadCachedData();
    } else {
      dispatch({ type: WEIGHT_ACTIONS.RESET_STATE });
    }
  }, [isAuthenticated]);

  const loadCachedData = async () => {
    try {
      const cachedMeasurements = await StorageService.getCachedMeasurements();
      const lastSync = await StorageService.getLastSync();

      if (cachedMeasurements && cachedMeasurements.length > 0) {
        dispatch({
          type: WEIGHT_ACTIONS.SET_MEASUREMENTS,
          payload: cachedMeasurements,
        });
        
        dispatch({
          type: WEIGHT_ACTIONS.SET_LATEST_MEASUREMENT,
          payload: cachedMeasurements[0],
        });
      }

      if (lastSync) {
        dispatch({
          type: WEIGHT_ACTIONS.SET_LAST_SYNC,
          payload: lastSync,
        });
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const saveMeasurement = async (measurementData) => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await createMeasurement(measurementData);

      if (response.success) {
        const newMeasurement = response.data;
        
        dispatch({
          type: WEIGHT_ACTIONS.ADD_MEASUREMENT,
          payload: newMeasurement,
        });

        // Update cached data
        const updatedMeasurements = [newMeasurement, ...state.measurements];
        await StorageService.saveCachedMeasurements(updatedMeasurements.slice(0, 50)); // Keep last 50
        await StorageService.saveLastSync();

        return { success: true, message: SUCCESS_MESSAGES.WEIGHT.MEASUREMENT_SAVED };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const fetchMeasurements = async (params = {}) => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await getMeasurements({
        limit: 20,
        skip: 0,
        sortBy: 'timestamp',
        order: 'DESC',
        ...params,
      });

      if (response.success) {
        const measurements = response.data.measurements || [];
        
        dispatch({
          type: WEIGHT_ACTIONS.SET_MEASUREMENTS,
          payload: measurements,
        });

        dispatch({
          type: WEIGHT_ACTIONS.SET_HAS_MORE,
          payload: measurements.length >= (params.limit || 20),
        });

        // Cache the data
        await StorageService.saveCachedMeasurements(measurements);
        await StorageService.saveLastSync();

        return { success: true, data: measurements };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const loadMoreMeasurements = async () => {
    if (!state.hasMore || state.loading) return;

    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });

      const response = await getMeasurements({
        limit: 20,
        skip: state.measurements.length,
        sortBy: 'timestamp',
        order: 'DESC',
      });

      if (response.success) {
        const newMeasurements = response.data.measurements || [];
        
        dispatch({
          type: WEIGHT_ACTIONS.ADD_MEASUREMENTS,
          payload: newMeasurements,
        });

        dispatch({
          type: WEIGHT_ACTIONS.SET_HAS_MORE,
          payload: newMeasurements.length >= 20,
        });

        return { success: true, data: newMeasurements };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const refreshMeasurements = async () => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_REFRESHING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await getMeasurements({
        limit: Math.max(20, state.measurements.length),
        skip: 0,
        sortBy: 'timestamp',
        order: 'DESC',
      });

      if (response.success) {
        const measurements = response.data.measurements || [];
        
        dispatch({
          type: WEIGHT_ACTIONS.SET_MEASUREMENTS,
          payload: measurements,
        });

        // Update cached data
        await StorageService.saveCachedMeasurements(measurements);
        await StorageService.saveLastSync();

        return { success: true, data: measurements };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: WEIGHT_ACTIONS.SET_REFRESHING, payload: false });
    }
  };

  const fetchLatestMeasurement = async () => {
    try {
      const response = await getLatestMeasurement();

      if (response.success && response.data) {
        dispatch({
          type: WEIGHT_ACTIONS.SET_LATEST_MEASUREMENT,
          payload: response.data,
        });

        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Error fetching latest measurement:', error);
      return { success: false, message: error.message };
    }
  };

  const fetchStatistics = async (params = {}) => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await getWeightStatistics(params);

      if (response.success) {
        dispatch({
          type: WEIGHT_ACTIONS.SET_STATISTICS,
          payload: response.data,
        });

        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();

      if (response) {
        dispatch({
          type: WEIGHT_ACTIONS.SET_DASHBOARD_STATS,
          payload: response,
        });

        if (response.latest) {
          dispatch({
            type: WEIGHT_ACTIONS.SET_LATEST_MEASUREMENT,
            payload: response.latest,
          });
        }

        return { success: true, data: response };
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return { success: false, message: error.message };
    }
  };

  const updateMeasurementData = async (id, measurementData) => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await updateMeasurement(id, measurementData);

      if (response.success) {
        const updatedMeasurement = response.data;
        
        dispatch({
          type: WEIGHT_ACTIONS.UPDATE_MEASUREMENT,
          payload: updatedMeasurement,
        });

        // Update cached data
        const updatedMeasurements = state.measurements.map(m =>
          m.id === id ? updatedMeasurement : m
        );
        await StorageService.saveCachedMeasurements(updatedMeasurements);

        return { success: true, message: 'Measurement updated successfully' };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const deleteMeasurementData = async (id) => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await deleteMeasurement(id);

      if (response.success) {
        dispatch({
          type: WEIGHT_ACTIONS.REMOVE_MEASUREMENT,
          payload: id,
        });

        // Update cached data
        const filteredMeasurements = state.measurements.filter(m => m.id !== id);
        await StorageService.saveCachedMeasurements(filteredMeasurements);

        return { success: true, message: SUCCESS_MESSAGES.WEIGHT.MEASUREMENT_DELETED };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    }
  };

  const fetchMeasurementsByRange = async (startDate, endDate) => {
    try {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });

      const response = await getMeasurementsByRange(startDate, endDate);

      if (response.success) {
        return { success: true, data: response.data.measurements || [] };
      }
    } catch (error) {
      const errorMessage = error.message || ERROR_MESSAGES.NETWORK.UNKNOWN;
      dispatch({ type: WEIGHT_ACTIONS.SET_ERROR, payload: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: WEIGHT_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: WEIGHT_ACTIONS.CLEAR_ERROR });
  };

  const resetState = () => {
    dispatch({ type: WEIGHT_ACTIONS.RESET_STATE });
  };

  const value = {
    // State
    measurements: state.measurements,
    latestMeasurement: state.latestMeasurement,
    statistics: state.statistics,
    dashboardStats: state.dashboardStats,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    refreshing: state.refreshing,
    lastSync: state.lastSync,

    // Computed values
    measurementCount: state.measurements.length,
    isEmpty: state.measurements.length === 0,

    // Actions
    saveMeasurement,
    fetchMeasurements,
    loadMoreMeasurements,
    refreshMeasurements,
    fetchLatestMeasurement,
    fetchStatistics,
    fetchDashboardStats,
    updateMeasurementData,
    deleteMeasurementData,
    fetchMeasurementsByRange,
    clearError,
    resetState,
  };

  return (
    <WeightContext.Provider value={value}>
      {children}
    </WeightContext.Provider>
  );
};

// Hook to use weight context
export const useWeight = () => {
  const context = useContext(WeightContext);
  if (!context) {
    throw new Error('useWeight must be used within a WeightProvider');
  }
  return context;
};

export default WeightContext;
