// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.100:3001/api', // Update with actual IP
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Bluetooth Configuration
export const BLUETOOTH_CONFIG = {
  SCAN_TIMEOUT: 10000,
  CONNECTION_TIMEOUT: 15000,
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_DELAY: 2000,
  
  // Weight Scale Service UUIDs (Generic Weight Scale)
  WEIGHT_SERVICE_UUID: '0000181D-0000-1000-8000-00805F9B34FB',
  WEIGHT_MEASUREMENT_UUID: '00002A9D-0000-1000-8000-00805F9B34FB',
  WEIGHT_FEATURE_UUID: '00002A9E-0000-1000-8000-00805F9B34FB',
  
  // Common device name patterns for weight scales
  DEVICE_NAME_PATTERNS: [
    'scale',
    'weight',
    'body',
    'smart',
    'mi',
    'xiaomi',
    'eufy',
    'withings',
    'fitbit',
    'garmin',
  ],
};

// Weight and measurement limits
export const WEIGHT_LIMITS = {
  MIN: 10,          // kg
  MAX: 300,         // kg
  GOAL_MIN: 30,     // kg
  GOAL_MAX: 300,    // kg
  PRECISION: 0.1,   // kg
};

export const HEIGHT_LIMITS = {
  MIN_CM: 100,      // cm
  MAX_CM: 250,      // cm
  MIN_FT: 3.3,      // feet
  MAX_FT: 8.2,      // feet
};

export const BMI_RANGES = {
  UNDERWEIGHT: { min: 0, max: 18.5, color: '#5AC8FA', label: 'Underweight' },
  NORMAL: { min: 18.5, max: 25, color: '#34C759', label: 'Normal' },
  OVERWEIGHT: { min: 25, max: 30, color: '#FF9500', label: 'Overweight' },
  OBESE: { min: 30, max: 100, color: '#FF3B30', label: 'Obese' },
};

// AsyncStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
  SETTINGS: '@settings',
  CACHED_MEASUREMENTS: '@cached_measurements',
  LAST_SYNC: '@last_sync',
  ONBOARDING_COMPLETED: '@onboarding_completed',
};

// App settings defaults
export const DEFAULT_SETTINGS = {
  units: {
    weight: 'kg', // 'kg' or 'lbs'
    height: 'cm', // 'cm' or 'ft'
  },
  notifications: {
    enabled: true,
    dailyReminder: true,
    reminderTime: '09:00',
    weeklyReport: true,
    goalAchievement: true,
  },
  privacy: {
    analytics: true,
    crashReporting: true,
  },
  bluetooth: {
    autoConnect: true,
    autoSave: true,
    stabilizationTime: 3, // seconds
  },
  display: {
    theme: 'light', // 'light' or 'dark' or 'auto'
    showBMI: true,
    showBodyMetrics: true,
  },
};

// Chart configuration
export const CHART_CONFIG = {
  COLORS: {
    weight: '#007AFF',
    bmi: '#5856D6',
    bodyFat: '#FF9500',
    muscleMass: '#34C759',
    water: '#5AC8FA',
  },
  TIME_PERIODS: {
    '7d': { label: '7 Days', days: 7 },
    '1m': { label: '1 Month', days: 30 },
    '3m': { label: '3 Months', days: 90 },
    '6m': { label: '6 Months', days: 180 },
    '1y': { label: '1 Year', days: 365 },
    'all': { label: 'All Time', days: null },
  },
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s'-]+$/,
  },
  PHONE: /^\+?[\d\s\-\(\)]+$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: {
    NO_CONNECTION: 'No internet connection. Please check your network.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNKNOWN: 'Something went wrong. Please try again.',
  },
  BLUETOOTH: {
    NOT_SUPPORTED: 'Bluetooth is not supported on this device.',
    NOT_ENABLED: 'Please enable Bluetooth to connect to your scale.',
    PERMISSION_DENIED: 'Bluetooth permission is required to connect to your scale.',
    CONNECTION_FAILED: 'Failed to connect to the scale. Please try again.',
    DEVICE_NOT_FOUND: 'Scale not found. Make sure it\'s powered on and nearby.',
    CONNECTION_LOST: 'Connection to scale was lost.',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_EXISTS: 'An account with this email already exists.',
    WEAK_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    INVALID_NAME: 'Name can only contain letters, spaces, hyphens, and apostrophes.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    INVALID_HEIGHT: 'Please enter a valid height.',
    INVALID_WEIGHT: 'Please enter a valid weight.',
    INVALID_AGE: 'You must be at least 13 years old.',
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  AUTH: {
    REGISTRATION: 'Account created successfully!',
    LOGIN: 'Welcome back!',
    LOGOUT: 'Logged out successfully.',
    PROFILE_UPDATED: 'Profile updated successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
  },
  WEIGHT: {
    MEASUREMENT_SAVED: 'Measurement saved successfully!',
    MEASUREMENT_DELETED: 'Measurement deleted.',
    GOAL_ACHIEVED: 'Congratulations! You\'ve reached your goal!',
  },
  BLUETOOTH: {
    CONNECTED: 'Connected to scale successfully!',
    DISCONNECTED: 'Disconnected from scale.',
  },
};

// Animation configurations
export const ANIMATIONS = {
  SPRING: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  TIMING: {
    duration: 250,
    useNativeDriver: true,
  },
  FADE: {
    duration: 200,
    useNativeDriver: true,
  },
};

// Notification types
export const NOTIFICATION_TYPES = {
  DAILY_REMINDER: 'daily_reminder',
  WEEKLY_REPORT: 'weekly_report',
  GOAL_ACHIEVEMENT: 'goal_achievement',
  CONNECTION_LOST: 'connection_lost',
  MEASUREMENT_SAVED: 'measurement_saved',
};

export default {
  API_CONFIG,
  BLUETOOTH_CONFIG,
  WEIGHT_LIMITS,
  HEIGHT_LIMITS,
  BMI_RANGES,
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  CHART_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATIONS,
  NOTIFICATION_TYPES,
};
