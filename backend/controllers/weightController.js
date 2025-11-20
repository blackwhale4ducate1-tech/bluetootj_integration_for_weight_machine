const { WeightMeasurement, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Create new weight measurement
const createMeasurement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { weight, unit = 'kg', bodyFat, muscleMass, boneMass, waterPercentage, notes } = req.body;

    const measurement = await WeightMeasurement.create({
      userId,
      weight,
      unit,
      bodyFat,
      muscleMass,
      boneMass,
      waterPercentage,
      notes,
      timestamp: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Weight measurement saved successfully',
      data: measurement
    });

  } catch (error) {
    next(error);
  }
};

// Get all measurements for user
const getMeasurements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      limit = 30, 
      skip = 0, 
      sortBy = 'timestamp', 
      order = 'DESC' 
    } = req.query;

    const measurements = await WeightMeasurement.findAll({
      where: { userId },
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [[sortBy, order]],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'height']
      }]
    });

    const totalCount = await WeightMeasurement.count({
      where: { userId }
    });

    res.json({
      success: true,
      message: 'Measurements retrieved successfully',
      data: {
        measurements,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: (parseInt(skip) + parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get latest measurement
const getLatestMeasurement = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const measurement = await WeightMeasurement.findOne({
      where: { userId },
      order: [['timestamp', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'height']
      }]
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'No measurements found',
        statusCode: 404
      });
    }

    res.json({
      success: true,
      message: 'Latest measurement retrieved successfully',
      data: measurement
    });

  } catch (error) {
    next(error);
  }
};

// Get measurement by ID
const getMeasurementById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const measurement = await WeightMeasurement.findOne({
      where: { 
        id: parseInt(id),
        userId 
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'height']
      }]
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found',
        statusCode: 404
      });
    }

    res.json({
      success: true,
      message: 'Measurement retrieved successfully',
      data: measurement
    });

  } catch (error) {
    next(error);
  }
};

// Get measurements by date range
const getMeasurementsByRange = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    const whereClause = { userId };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        whereClause.timestamp[Op.lte] = end;
      }
    }

    const measurements = await WeightMeasurement.findAll({
      where: whereClause,
      order: [['timestamp', 'ASC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'height']
      }]
    });

    res.json({
      success: true,
      message: 'Measurements retrieved successfully',
      data: {
        measurements,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null,
          count: measurements.length
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get weight statistics
const getWeightStatistics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period = 'week' } = req.query;

    const whereClause = { userId };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.timestamp[Op.lte] = end;
      }
    }

    // Get all measurements for statistics
    const measurements = await WeightMeasurement.findAll({
      where: whereClause,
      order: [['timestamp', 'ASC']],
      attributes: ['weight', 'bmi', 'timestamp', 'unit']
    });

    if (measurements.length === 0) {
      return res.json({
        success: true,
        message: 'No measurements found for the specified period',
        data: {
          totalMeasurements: 0,
          currentWeight: null,
          averageWeight: null,
          minWeight: null,
          maxWeight: null,
          weightChange: null,
          bmiCurrent: null,
          bmiAverage: null,
          trend: 'stable',
          periodAverages: []
        }
      });
    }

    // Convert all weights to kg for calculations
    const weightsInKg = measurements.map(m => {
      return m.unit === 'lbs' ? m.weight / 2.20462 : m.weight;
    });

    const bmis = measurements.filter(m => m.bmi).map(m => parseFloat(m.bmi));

    // Calculate basic statistics
    const totalMeasurements = measurements.length;
    const currentWeight = weightsInKg[weightsInKg.length - 1];
    const averageWeight = weightsInKg.reduce((sum, w) => sum + w, 0) / weightsInKg.length;
    const minWeight = Math.min(...weightsInKg);
    const maxWeight = Math.max(...weightsInKg);
    const weightChange = weightsInKg.length > 1 ? currentWeight - weightsInKg[0] : 0;

    const bmiCurrent = bmis.length > 0 ? bmis[bmis.length - 1] : null;
    const bmiAverage = bmis.length > 0 ? bmis.reduce((sum, b) => sum + b, 0) / bmis.length : null;

    // Determine trend (compare last 3 vs first 3 measurements)
    let trend = 'stable';
    if (weightsInKg.length >= 6) {
      const firstThree = weightsInKg.slice(0, 3).reduce((sum, w) => sum + w, 0) / 3;
      const lastThree = weightsInKg.slice(-3).reduce((sum, w) => sum + w, 0) / 3;
      const difference = lastThree - firstThree;
      
      if (difference > 0.5) {
        trend = 'increasing';
      } else if (difference < -0.5) {
        trend = 'decreasing';
      }
    }

    // Calculate period averages
    const periodAverages = [];
    if (measurements.length > 0) {
      const groupedByPeriod = {};
      
      measurements.forEach(measurement => {
        const date = new Date(measurement.timestamp);
        let periodKey;
        
        if (period === 'week') {
          const year = date.getFullYear();
          const week = getWeekNumber(date);
          periodKey = `${year}-W${week.toString().padStart(2, '0')}`;
        } else if (period === 'month') {
          periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        } else { // day
          periodKey = date.toISOString().split('T')[0];
        }
        
        if (!groupedByPeriod[periodKey]) {
          groupedByPeriod[periodKey] = [];
        }
        
        const weightInKg = measurement.unit === 'lbs' ? measurement.weight / 2.20462 : measurement.weight;
        groupedByPeriod[periodKey].push(weightInKg);
      });
      
      Object.keys(groupedByPeriod).forEach(key => {
        const weights = groupedByPeriod[key];
        const average = weights.reduce((sum, w) => sum + w, 0) / weights.length;
        periodAverages.push({
          period: key,
          average: Math.round(average * 100) / 100,
          count: weights.length
        });
      });
    }

    res.json({
      success: true,
      message: 'Weight statistics retrieved successfully',
      data: {
        totalMeasurements,
        currentWeight: Math.round(currentWeight * 100) / 100,
        averageWeight: Math.round(averageWeight * 100) / 100,
        minWeight: Math.round(minWeight * 100) / 100,
        maxWeight: Math.round(maxWeight * 100) / 100,
        weightChange: Math.round(weightChange * 100) / 100,
        bmiCurrent: bmiCurrent ? Math.round(bmiCurrent * 100) / 100 : null,
        bmiAverage: bmiAverage ? Math.round(bmiAverage * 100) / 100 : null,
        trend,
        periodAverages
      }
    });

  } catch (error) {
    next(error);
  }
};

// Update measurement
const updateMeasurement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { weight, unit, bodyFat, muscleMass, boneMass, waterPercentage, notes } = req.body;

    const measurement = await WeightMeasurement.findOne({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found',
        statusCode: 404
      });
    }

    await measurement.update({
      ...(weight !== undefined && { weight }),
      ...(unit !== undefined && { unit }),
      ...(bodyFat !== undefined && { bodyFat }),
      ...(muscleMass !== undefined && { muscleMass }),
      ...(boneMass !== undefined && { boneMass }),
      ...(waterPercentage !== undefined && { waterPercentage }),
      ...(notes !== undefined && { notes })
    });

    res.json({
      success: true,
      message: 'Measurement updated successfully',
      data: measurement
    });

  } catch (error) {
    next(error);
  }
};

// Delete measurement
const deleteMeasurement = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const measurement = await WeightMeasurement.findOne({
      where: { 
        id: parseInt(id),
        userId 
      }
    });

    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Measurement not found',
        statusCode: 404
      });
    }

    await measurement.destroy();

    res.json({
      success: true,
      message: 'Measurement deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Export measurements
const exportMeasurements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { format = 'json', startDate, endDate } = req.query;

    const whereClause = { userId };

    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) {
        whereClause.timestamp[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.timestamp[Op.lte] = end;
      }
    }

    const measurements = await WeightMeasurement.findAll({
      where: whereClause,
      order: [['timestamp', 'ASC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = 'Date,Weight,Unit,BMI,Body Fat %,Muscle Mass,Bone Mass,Water %,Notes\n';
      const csvRows = measurements.map(m => {
        const date = new Date(m.timestamp).toISOString().split('T')[0];
        return `${date},${m.weight},${m.unit},${m.bmi || ''},${m.bodyFat || ''},${m.muscleMass || ''},${m.boneMass || ''},${m.waterPercentage || ''},"${m.notes || ''}"`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=weight_measurements.csv');
      res.send(csvHeaders + csvRows);
    } else {
      // Return JSON
      res.json({
        success: true,
        message: 'Measurements exported successfully',
        data: {
          measurements,
          exportInfo: {
            format: 'json',
            totalRecords: measurements.length,
            dateRange: {
              startDate: startDate || null,
              endDate: endDate || null
            },
            exportedAt: new Date().toISOString()
          }
        }
      });
    }

  } catch (error) {
    next(error);
  }
};

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = {
  createMeasurement,
  getMeasurements,
  getLatestMeasurement,
  getMeasurementById,
  getMeasurementsByRange,
  getWeightStatistics,
  updateMeasurement,
  deleteMeasurement,
  exportMeasurements
};
