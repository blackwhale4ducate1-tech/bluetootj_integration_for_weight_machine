import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { BMI_RANGES, WEIGHT_LIMITS } from './constants';

/**
 * Date and time formatting utilities
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

export const formatTime = (date, formatString = 'HH:mm') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

export const formatDateTime = (date, formatString = 'MMM dd, yyyy HH:mm') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getDateLabel = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE'); // Day name
  } else if (isThisMonth(dateObj)) {
    return format(dateObj, 'MMM dd');
  } else {
    return format(dateObj, 'MMM dd, yyyy');
  }
};

/**
 * Weight and BMI calculations
 */
export const calculateBMI = (weightKg, heightM) => {
  if (!weightKg || !heightM || heightM <= 0) return null;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

export const getBMICategory = (bmi) => {
  if (!bmi) return null;
  
  for (const [category, range] of Object.entries(BMI_RANGES)) {
    if (bmi >= range.min && bmi < range.max) {
      return {
        category,
        label: range.label,
        color: range.color,
      };
    }
  }
  
  return null;
};

export const convertWeight = (weight, fromUnit, toUnit) => {
  if (!weight || fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Math.round(weight * 2.20462 * 100) / 100;
  } else if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Math.round(weight / 2.20462 * 100) / 100;
  }
  
  return weight;
};

export const convertHeight = (height, fromUnit, toUnit) => {
  if (!height || fromUnit === toUnit) return height;
  
  if (fromUnit === 'cm' && toUnit === 'm') {
    return height / 100;
  } else if (fromUnit === 'm' && toUnit === 'cm') {
    return height * 100;
  } else if (fromUnit === 'cm' && toUnit === 'ft') {
    return Math.round(height / 30.48 * 100) / 100;
  } else if (fromUnit === 'ft' && toUnit === 'cm') {
    return Math.round(height * 30.48 * 100) / 100;
  }
  
  return height;
};

export const formatWeight = (weight, unit = 'kg', precision = 1) => {
  if (!weight) return '0';
  return `${weight.toFixed(precision)} ${unit}`;
};

export const formatHeight = (height, unit = 'cm') => {
  if (!height) return '0';
  
  if (unit === 'ft') {
    const feet = Math.floor(height);
    const inches = Math.round((height - feet) * 12);
    return `${feet}'${inches}"`;
  }
  
  return `${height} ${unit}`;
};

/**
 * Weight trend analysis
 */
export const calculateWeightTrend = (measurements) => {
  if (!measurements || measurements.length < 2) {
    return { trend: 'stable', change: 0, percentage: 0 };
  }
  
  // Sort by date (newest first)
  const sorted = [...measurements].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const latest = sorted[0];
  const previous = sorted[1];
  
  const change = latest.weight - previous.weight;
  const percentage = (change / previous.weight) * 100;
  
  let trend = 'stable';
  if (Math.abs(change) > 0.1) { // Significant change threshold
    trend = change > 0 ? 'increasing' : 'decreasing';
  }
  
  return {
    trend,
    change: Math.round(change * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
  };
};

export const calculateWeightChange = (measurements, period = 'week') => {
  if (!measurements || measurements.length < 2) return null;
  
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3months':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(measurements[measurements.length - 1].timestamp);
  }
  
  const periodMeasurements = measurements.filter(m => 
    new Date(m.timestamp) >= startDate
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  if (periodMeasurements.length < 2) return null;
  
  const first = periodMeasurements[0];
  const last = periodMeasurements[periodMeasurements.length - 1];
  
  const change = last.weight - first.weight;
  const percentage = (change / first.weight) * 100;
  
  return {
    change: Math.round(change * 100) / 100,
    percentage: Math.round(percentage * 100) / 100,
    period,
    startWeight: first.weight,
    endWeight: last.weight,
    startDate: first.timestamp,
    endDate: last.timestamp,
  };
};

/**
 * Data validation utilities
 */
export const isValidWeight = (weight, unit = 'kg') => {
  if (!weight || isNaN(weight)) return false;
  
  const weightKg = unit === 'lbs' ? convertWeight(weight, 'lbs', 'kg') : weight;
  return weightKg >= WEIGHT_LIMITS.MIN && weightKg <= WEIGHT_LIMITS.MAX;
};

export const isValidHeight = (height, unit = 'cm') => {
  if (!height || isNaN(height)) return false;
  
  if (unit === 'cm') {
    return height >= 100 && height <= 250;
  } else if (unit === 'ft') {
    return height >= 3.3 && height <= 8.2;
  }
  
  return false;
};

export const isValidBMI = (bmi) => {
  return bmi && !isNaN(bmi) && bmi >= 10 && bmi <= 50;
};

/**
 * String utilities
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const formatName = (firstName, lastName) => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ');
};

export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

/**
 * Array utilities
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const groupMeasurementsByDate = (measurements) => {
  return groupBy(measurements, (measurement) => {
    return formatDate(measurement.timestamp, 'yyyy-MM-dd');
  });
};

export const sortMeasurements = (measurements, sortBy = 'timestamp', order = 'desc') => {
  return [...measurements].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (order === 'desc') {
      return bValue > aValue ? 1 : -1;
    } else {
      return aValue > bValue ? 1 : -1;
    }
  });
};

/**
 * Chart data utilities
 */
export const prepareChartData = (measurements, period = '1m') => {
  if (!measurements || measurements.length === 0) {
    return { labels: [], datasets: [] };
  }
  
  // Sort by date
  const sorted = sortMeasurements(measurements, 'timestamp', 'asc');
  
  // Filter by period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '1m':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '3m':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '6m':
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = null;
  }
  
  const filtered = startDate 
    ? sorted.filter(m => new Date(m.timestamp) >= startDate)
    : sorted;
  
  const labels = filtered.map(m => formatDate(m.timestamp, 'MMM dd'));
  const weights = filtered.map(m => m.weight);
  const bmis = filtered.map(m => m.bmi).filter(Boolean);
  
  return {
    labels,
    datasets: [
      {
        data: weights,
        color: () => '#007AFF',
        strokeWidth: 2,
      },
    ],
    bmiData: bmis,
  };
};

/**
 * Statistics calculations
 */
export const calculateStatistics = (measurements) => {
  if (!measurements || measurements.length === 0) {
    return null;
  }
  
  const weights = measurements.map(m => m.weight);
  const bmis = measurements.map(m => m.bmi).filter(Boolean);
  
  const stats = {
    count: measurements.length,
    weight: {
      current: weights[0],
      average: weights.reduce((sum, w) => sum + w, 0) / weights.length,
      min: Math.min(...weights),
      max: Math.max(...weights),
      change: weights.length > 1 ? weights[0] - weights[weights.length - 1] : 0,
    },
  };
  
  if (bmis.length > 0) {
    stats.bmi = {
      current: bmis[0],
      average: bmis.reduce((sum, b) => sum + b, 0) / bmis.length,
      min: Math.min(...bmis),
      max: Math.max(...bmis),
    };
  }
  
  // Round all values
  Object.keys(stats.weight).forEach(key => {
    stats.weight[key] = Math.round(stats.weight[key] * 100) / 100;
  });
  
  if (stats.bmi) {
    Object.keys(stats.bmi).forEach(key => {
      stats.bmi[key] = Math.round(stats.bmi[key] * 10) / 10;
    });
  }
  
  return stats;
};

/**
 * Device utilities
 */
export const isBluetoothDevice = (device) => {
  if (!device || !device.name) return false;
  
  const name = device.name.toLowerCase();
  const patterns = ['scale', 'weight', 'body', 'smart', 'mi', 'xiaomi'];
  
  return patterns.some(pattern => name.includes(pattern));
};

export const getDeviceSignalStrength = (rssi) => {
  if (!rssi) return 'unknown';
  
  if (rssi >= -50) return 'excellent';
  if (rssi >= -60) return 'good';
  if (rssi >= -70) return 'fair';
  if (rssi >= -80) return 'poor';
  return 'very poor';
};

/**
 * Error handling utilities
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network') ||
         error?.message?.includes('connection');
};

/**
 * Debounce utility
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle utility
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {
  // Date utilities
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  getDateLabel,
  
  // Weight utilities
  calculateBMI,
  getBMICategory,
  convertWeight,
  convertHeight,
  formatWeight,
  formatHeight,
  calculateWeightTrend,
  calculateWeightChange,
  
  // Validation utilities
  isValidWeight,
  isValidHeight,
  isValidBMI,
  
  // String utilities
  capitalize,
  truncate,
  formatName,
  getInitials,
  
  // Array utilities
  groupBy,
  groupMeasurementsByDate,
  sortMeasurements,
  
  // Chart utilities
  prepareChartData,
  
  // Statistics
  calculateStatistics,
  
  // Device utilities
  isBluetoothDevice,
  getDeviceSignalStrength,
  
  // Error utilities
  getErrorMessage,
  isNetworkError,
  
  // Performance utilities
  debounce,
  throttle,
};
