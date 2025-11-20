const { body, query, param } = require('express-validator');

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters')
    .trim(),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters')
    .trim(),
  
  body('height')
    .optional()
    .isFloat({ min: 0.5, max: 3.0 })
    .withMessage('Height must be between 0.5 and 3.0 meters'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth in YYYY-MM-DD format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date >= today) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    }),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other')
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// User profile update validation
const validateUserProfileUpdate = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be between 1 and 100 characters')
    .trim(),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be between 1 and 100 characters')
    .trim(),
  
  body('height')
    .optional()
    .isFloat({ min: 0.5, max: 3.0 })
    .withMessage('Height must be between 0.5 and 3.0 meters'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date of birth in YYYY-MM-DD format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      if (date >= today) {
        throw new Error('Date of birth cannot be in the future');
      }
      return true;
    }),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other')
];

// Weight measurement validation
const validateWeightMeasurement = [
  body('weight')
    .isFloat({ min: 10, max: 300 })
    .withMessage('Weight must be between 10 and 300 kg'),
  
  body('unit')
    .optional()
    .isIn(['kg', 'lbs'])
    .withMessage('Unit must be either kg or lbs'),
  
  body('bodyFat')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Body fat percentage must be between 0 and 50%'),
  
  body('muscleMass')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Muscle mass must be between 0 and 100 kg'),
  
  body('boneMass')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Bone mass must be between 0 and 10 kg'),
  
  body('waterPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Water percentage must be between 0 and 100%'),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim()
];

// Weight measurement update validation
const validateWeightMeasurementUpdate = [
  body('weight')
    .optional()
    .isFloat({ min: 10, max: 300 })
    .withMessage('Weight must be between 10 and 300 kg'),
  
  body('unit')
    .optional()
    .isIn(['kg', 'lbs'])
    .withMessage('Unit must be either kg or lbs'),
  
  body('bodyFat')
    .optional()
    .isFloat({ min: 0, max: 50 })
    .withMessage('Body fat percentage must be between 0 and 50%'),
  
  body('muscleMass')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Muscle mass must be between 0 and 100 kg'),
  
  body('boneMass')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Bone mass must be between 0 and 10 kg'),
  
  body('waterPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Water percentage must be between 0 and 100%'),
  
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
    .trim()
];

// Query parameter validations
const validateMeasurementQuery = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer'),
  
  query('sortBy')
    .optional()
    .isIn(['timestamp', 'weight', 'bmi', 'createdAt'])
    .withMessage('SortBy must be one of: timestamp, weight, bmi, createdAt'),
  
  query('order')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Order must be either ASC or DESC')
];

const validateDateRangeQuery = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be in YYYY-MM-DD format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be in YYYY-MM-DD format')
    .custom((value, { req }) => {
      if (req.query.startDate && value) {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(value);
        if (endDate < startDate) {
          throw new Error('End date cannot be before start date');
        }
      }
      return true;
    }),
  
  query('period')
    .optional()
    .isIn(['day', 'week', 'month'])
    .withMessage('Period must be one of: day, week, month')
];

// ID parameter validation
const validateIdParam = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  validatePasswordChange,
  validateWeightMeasurement,
  validateWeightMeasurementUpdate,
  validateMeasurementQuery,
  validateDateRangeQuery,
  validateIdParam
};
