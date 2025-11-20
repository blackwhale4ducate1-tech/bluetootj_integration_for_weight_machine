import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import BluetoothService from '../services/BluetoothService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

// Initial state
const initialState = {
  isScanning: false,
  devices: [],
  connectedDevice: null,
  currentWeight: null,
  isBluetoothEnabled: false,
  isConnecting: false,
  error: null,
  connectionHistory: [],
};

// Action types
const BLUETOOTH_ACTIONS = {
  SET_SCANNING: 'SET_SCANNING',
  SET_DEVICES: 'SET_DEVICES',
  ADD_DEVICE: 'ADD_DEVICE',
  SET_CONNECTED_DEVICE: 'SET_CONNECTED_DEVICE',
  SET_CURRENT_WEIGHT: 'SET_CURRENT_WEIGHT',
  SET_BLUETOOTH_ENABLED: 'SET_BLUETOOTH_ENABLED',
  SET_CONNECTING: 'SET_CONNECTING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const bluetoothReducer = (state, action) => {
  switch (action.type) {
    case BLUETOOTH_ACTIONS.SET_SCANNING:
      return {
        ...state,
        isScanning: action.payload,
        error: action.payload ? null : state.error,
      };

    case BLUETOOTH_ACTIONS.SET_DEVICES:
      return {
        ...state,
        devices: action.payload,
      };

    case BLUETOOTH_ACTIONS.ADD_DEVICE:
      const existingDeviceIndex = state.devices.findIndex(
        device => device.id === action.payload.id
      );
      
      if (existingDeviceIndex >= 0) {
        // Update existing device
        const updatedDevices = [...state.devices];
        updatedDevices[existingDeviceIndex] = action.payload;
        return {
          ...state,
          devices: updatedDevices,
        };
      } else {
        // Add new device
        return {
          ...state,
          devices: [...state.devices, action.payload],
        };
      }

    case BLUETOOTH_ACTIONS.SET_CONNECTED_DEVICE:
      return {
        ...state,
        connectedDevice: action.payload,
        isConnecting: false,
        error: action.payload ? null : state.error,
      };

    case BLUETOOTH_ACTIONS.SET_CURRENT_WEIGHT:
      return {
        ...state,
        currentWeight: action.payload,
      };

    case BLUETOOTH_ACTIONS.SET_BLUETOOTH_ENABLED:
      return {
        ...state,
        isBluetoothEnabled: action.payload,
      };

    case BLUETOOTH_ACTIONS.SET_CONNECTING:
      return {
        ...state,
        isConnecting: action.payload,
        error: action.payload ? null : state.error,
      };

    case BLUETOOTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isScanning: false,
        isConnecting: false,
      };

    case BLUETOOTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case BLUETOOTH_ACTIONS.ADD_TO_HISTORY:
      return {
        ...state,
        connectionHistory: [action.payload, ...state.connectionHistory.slice(0, 9)], // Keep last 10
      };

    case BLUETOOTH_ACTIONS.RESET_STATE:
      return {
        ...initialState,
        isBluetoothEnabled: state.isBluetoothEnabled,
      };

    default:
      return state;
  }
};

// Create context
const BluetoothContext = createContext();

// Provider component
export const BluetoothProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bluetoothReducer, initialState);
  const bluetoothListenerRef = useRef(null);

  // Initialize Bluetooth service
  useEffect(() => {
    initializeBluetooth();
    setupBluetoothListeners();

    return () => {
      cleanupBluetoothListeners();
    };
  }, []);

  const initializeBluetooth = async () => {
    try {
      const isEnabled = await BluetoothService.isBluetoothEnabled();
      dispatch({
        type: BLUETOOTH_ACTIONS.SET_BLUETOOTH_ENABLED,
        payload: isEnabled,
      });
    } catch (error) {
      console.error('Bluetooth initialization error:', error);
      dispatch({
        type: BLUETOOTH_ACTIONS.SET_ERROR,
        payload: error.message,
      });
    }
  };

  const setupBluetoothListeners = () => {
    const listener = {
      scanStarted: () => {
        dispatch({ type: BLUETOOTH_ACTIONS.SET_SCANNING, payload: true });
        dispatch({ type: BLUETOOTH_ACTIONS.SET_DEVICES, payload: [] });
      },

      scanStopped: () => {
        dispatch({ type: BLUETOOTH_ACTIONS.SET_SCANNING, payload: false });
      },

      deviceFound: (device) => {
        dispatch({ type: BLUETOOTH_ACTIONS.ADD_DEVICE, payload: device });
      },

      scanError: (error) => {
        dispatch({
          type: BLUETOOTH_ACTIONS.SET_ERROR,
          payload: error.message || ERROR_MESSAGES.BLUETOOTH.DEVICE_NOT_FOUND,
        });
      },

      connectionStarted: (deviceId) => {
        dispatch({ type: BLUETOOTH_ACTIONS.SET_CONNECTING, payload: true });
      },

      deviceConnected: (device) => {
        dispatch({
          type: BLUETOOTH_ACTIONS.SET_CONNECTED_DEVICE,
          payload: device,
        });
        
        dispatch({
          type: BLUETOOTH_ACTIONS.ADD_TO_HISTORY,
          payload: {
            device,
            connectedAt: new Date().toISOString(),
            status: 'connected',
          },
        });
      },

      deviceDisconnected: (error) => {
        const previousDevice = state.connectedDevice;
        
        dispatch({
          type: BLUETOOTH_ACTIONS.SET_CONNECTED_DEVICE,
          payload: null,
        });
        
        dispatch({
          type: BLUETOOTH_ACTIONS.SET_CURRENT_WEIGHT,
          payload: null,
        });

        if (previousDevice) {
          dispatch({
            type: BLUETOOTH_ACTIONS.ADD_TO_HISTORY,
            payload: {
              device: previousDevice,
              disconnectedAt: new Date().toISOString(),
              status: 'disconnected',
              error: error?.message,
            },
          });
        }

        if (error) {
          dispatch({
            type: BLUETOOTH_ACTIONS.SET_ERROR,
            payload: ERROR_MESSAGES.BLUETOOTH.CONNECTION_LOST,
          });
        }
      },

      connectionError: (error) => {
        dispatch({
          type: BLUETOOTH_ACTIONS.SET_ERROR,
          payload: error.message || ERROR_MESSAGES.BLUETOOTH.CONNECTION_FAILED,
        });
      },

      weightMeasurement: (weightData) => {
        dispatch({
          type: BLUETOOTH_ACTIONS.SET_CURRENT_WEIGHT,
          payload: weightData,
        });
      },
    };

    bluetoothListenerRef.current = listener;
    BluetoothService.addListener(listener);
  };

  const cleanupBluetoothListeners = () => {
    if (bluetoothListenerRef.current) {
      BluetoothService.removeListener(bluetoothListenerRef.current);
      bluetoothListenerRef.current = null;
    }
  };

  const startScan = async () => {
    try {
      dispatch({ type: BLUETOOTH_ACTIONS.CLEAR_ERROR });
      await BluetoothService.startScan();
    } catch (error) {
      dispatch({
        type: BLUETOOTH_ACTIONS.SET_ERROR,
        payload: error.message,
      });
    }
  };

  const stopScan = () => {
    BluetoothService.stopScan();
  };

  const connectToDevice = async (deviceId) => {
    try {
      dispatch({ type: BLUETOOTH_ACTIONS.CLEAR_ERROR });
      await BluetoothService.connectToDevice(deviceId);
    } catch (error) {
      dispatch({
        type: BLUETOOTH_ACTIONS.SET_ERROR,
        payload: error.message,
      });
    }
  };

  const disconnect = async () => {
    try {
      await BluetoothService.disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const checkBluetoothStatus = async () => {
    try {
      const isEnabled = await BluetoothService.isBluetoothEnabled();
      dispatch({
        type: BLUETOOTH_ACTIONS.SET_BLUETOOTH_ENABLED,
        payload: isEnabled,
      });
      return isEnabled;
    } catch (error) {
      dispatch({
        type: BLUETOOTH_ACTIONS.SET_ERROR,
        payload: error.message,
      });
      return false;
    }
  };

  const clearError = () => {
    dispatch({ type: BLUETOOTH_ACTIONS.CLEAR_ERROR });
  };

  const resetState = () => {
    dispatch({ type: BLUETOOTH_ACTIONS.RESET_STATE });
  };

  const getDeviceById = (deviceId) => {
    return state.devices.find(device => device.id === deviceId);
  };

  const getLastConnectedDevice = () => {
    const lastConnection = state.connectionHistory.find(
      history => history.status === 'connected'
    );
    return lastConnection?.device || null;
  };

  const isDeviceInRange = (deviceId) => {
    const device = getDeviceById(deviceId);
    return device && device.rssi && device.rssi > -80; // Consider device in range if RSSI > -80
  };

  const value = {
    // State
    isScanning: state.isScanning,
    devices: state.devices,
    connectedDevice: state.connectedDevice,
    currentWeight: state.currentWeight,
    isBluetoothEnabled: state.isBluetoothEnabled,
    isConnecting: state.isConnecting,
    error: state.error,
    connectionHistory: state.connectionHistory,

    // Computed values
    isConnected: !!state.connectedDevice,
    deviceCount: state.devices.length,

    // Actions
    startScan,
    stopScan,
    connectToDevice,
    disconnect,
    checkBluetoothStatus,
    clearError,
    resetState,

    // Helper functions
    getDeviceById,
    getLastConnectedDevice,
    isDeviceInRange,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

// Hook to use Bluetooth context
export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    // Fallback stub to avoid runtime crash if provider is missing
    console.warn('useBluetooth used outside of BluetoothProvider. Returning default stub.');
    return {
      // State
      isScanning: false,
      devices: [],
      connectedDevice: null,
      currentWeight: null,
      isBluetoothEnabled: false,
      isConnecting: false,
      error: null,
      connectionHistory: [],

      // Computed
      isConnected: false,
      deviceCount: 0,

      // No-op actions
      startScan: async () => {},
      stopScan: () => {},
      connectToDevice: async () => {},
      disconnect: async () => {},
      checkBluetoothStatus: async () => false,
      clearError: () => {},
      resetState: () => {},

      // Helpers
      getDeviceById: () => null,
      getLastConnectedDevice: () => null,
      isDeviceInRange: () => false,
    };
  }
  return context;
};

export default BluetoothContext;
