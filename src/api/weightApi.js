import apiClient, { apiCall } from './axiosConfig';

/**
 * Weight measurement API functions
 */

// Create a new weight measurement
export const createMeasurement = async (measurementData) => {
  return apiCall(async () => {
    const response = await apiClient.post('/weight/measurements', {
      weight: measurementData.weight,
      unit: measurementData.unit || 'kg',
      bodyFat: measurementData.bodyFat,
      muscleMass: measurementData.muscleMass,
      boneMass: measurementData.boneMass,
      waterPercentage: measurementData.waterPercentage,
      timestamp: measurementData.timestamp || new Date().toISOString(),
      notes: measurementData.notes,
    });
    
    return response.data;
  });
};

// Get all measurements with pagination
export const getMeasurements = async (params = {}) => {
  return apiCall(async () => {
    const queryParams = new URLSearchParams({
      limit: params.limit || 20,
      skip: params.skip || 0,
      sortBy: params.sortBy || 'timestamp',
      order: params.order || 'DESC',
      ...params,
    });
    
    const response = await apiClient.get(`/weight/measurements?${queryParams}`);
    return response.data;
  });
};

// Get latest measurement
export const getLatestMeasurement = async () => {
  return apiCall(async () => {
    const response = await apiClient.get('/weight/measurements/latest');
    return response.data;
  });
};

// Get measurement by ID
export const getMeasurementById = async (id) => {
  return apiCall(async () => {
    const response = await apiClient.get(`/weight/measurements/${id}`);
    return response.data;
  });
};

// Get measurements by date range
export const getMeasurementsByRange = async (startDate, endDate, params = {}) => {
  return apiCall(async () => {
    const queryParams = new URLSearchParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      limit: params.limit || 100,
      skip: params.skip || 0,
      sortBy: params.sortBy || 'timestamp',
      order: params.order || 'DESC',
    });
    
    const response = await apiClient.get(`/weight/measurements/range?${queryParams}`);
    return response.data;
  });
};

// Get weight statistics
export const getWeightStatistics = async (params = {}) => {
  return apiCall(async () => {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) {
      queryParams.append('startDate', params.startDate.toISOString().split('T')[0]);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate.toISOString().split('T')[0]);
    }
    if (params.period) {
      queryParams.append('period', params.period);
    }
    
    const response = await apiClient.get(`/weight/measurements/stats?${queryParams}`);
    return response.data;
  });
};

// Update measurement
export const updateMeasurement = async (id, measurementData) => {
  return apiCall(async () => {
    const response = await apiClient.put(`/weight/measurements/${id}`, {
      weight: measurementData.weight,
      unit: measurementData.unit,
      bodyFat: measurementData.bodyFat,
      muscleMass: measurementData.muscleMass,
      boneMass: measurementData.boneMass,
      waterPercentage: measurementData.waterPercentage,
      notes: measurementData.notes,
    });
    
    return response.data;
  });
};

// Delete measurement
export const deleteMeasurement = async (id) => {
  return apiCall(async () => {
    const response = await apiClient.delete(`/weight/measurements/${id}`);
    return response.data;
  });
};

// Export measurements
export const exportMeasurements = async (format = 'json', params = {}) => {
  return apiCall(async () => {
    const queryParams = new URLSearchParams({
      format,
      ...params,
    });
    
    if (params.startDate) {
      queryParams.set('startDate', params.startDate.toISOString().split('T')[0]);
    }
    if (params.endDate) {
      queryParams.set('endDate', params.endDate.toISOString().split('T')[0]);
    }
    
    const response = await apiClient.get(`/weight/measurements/export?${queryParams}`);
    return response.data;
  });
};

// Get measurements for chart (optimized for visualization)
export const getMeasurementsForChart = async (period = '1m') => {
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
      // All time - don't set start date
      break;
  }
  
  if (startDate) {
    return getMeasurementsByRange(startDate, now, {
      limit: 1000,
      sortBy: 'timestamp',
      order: 'ASC',
    });
  } else {
    return getMeasurements({
      limit: 1000,
      sortBy: 'timestamp',
      order: 'ASC',
    });
  }
};

// Get quick stats for dashboard
export const getDashboardStats = async () => {
  return apiCall(async () => {
    const [latest, weekStats, monthStats] = await Promise.all([
      getLatestMeasurement().catch(() => null),
      getWeightStatistics({ period: 'week' }).catch(() => null),
      getWeightStatistics({ period: 'month' }).catch(() => null),
    ]);
    
    return {
      latest: latest?.data || null,
      weekStats: weekStats?.data || null,
      monthStats: monthStats?.data || null,
    };
  });
};

export default {
  createMeasurement,
  getMeasurements,
  getLatestMeasurement,
  getMeasurementById,
  getMeasurementsByRange,
  getWeightStatistics,
  updateMeasurement,
  deleteMeasurement,
  exportMeasurements,
  getMeasurementsForChart,
  getDashboardStats,
};
