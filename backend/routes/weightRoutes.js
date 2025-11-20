const express = require('express');
const router = express.Router();

const {
  createMeasurement,
  getMeasurements,
  getLatestMeasurement,
  getMeasurementById,
  getMeasurementsByRange,
  getWeightStatistics,
  updateMeasurement,
  deleteMeasurement,
  exportMeasurements
} = require('../controllers/weightController');

const { authMiddleware } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/errorHandler');

const {
  validateWeightMeasurement,
  validateWeightMeasurementUpdate,
  validateMeasurementQuery,
  validateDateRangeQuery,
  validateIdParam
} = require('../utils/validators');

// All weight routes require authentication
router.use(authMiddleware);

// Measurement CRUD operations
router.post('/measurements', validateWeightMeasurement, handleValidationErrors, createMeasurement);

router.get('/measurements', validateMeasurementQuery, handleValidationErrors, getMeasurements);

router.get('/measurements/latest', getLatestMeasurement);

router.get('/measurements/range', validateDateRangeQuery, handleValidationErrors, getMeasurementsByRange);

router.get('/measurements/stats', validateDateRangeQuery, handleValidationErrors, getWeightStatistics);

router.get('/measurements/export', validateDateRangeQuery, handleValidationErrors, exportMeasurements);

router.get('/measurements/:id', validateIdParam, handleValidationErrors, getMeasurementById);

router.put('/measurements/:id', validateIdParam, validateWeightMeasurementUpdate, handleValidationErrors, updateMeasurement);

router.delete('/measurements/:id', validateIdParam, handleValidationErrors, deleteMeasurement);

module.exports = router;
