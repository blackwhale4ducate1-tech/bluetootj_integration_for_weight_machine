const { validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      })),
      statusCode: 400
    });
  }
  next();
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = 'Validation failed';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message,
      errors,
      statusCode: 400
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} already exists`,
      value: error.value
    }));
    
    return res.status(409).json({
      success: false,
      message,
      errors,
      statusCode: 409
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Invalid reference to related resource';
    
    return res.status(400).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      statusCode: 400
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    
    return res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      statusCode: 401
    });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    
    return res.status(401).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      statusCode: 401
    });
  }

  // Cast error (invalid ObjectId format)
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    
    return res.status(404).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      statusCode: 404
    });
  }

  // Default error
  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    statusCode
  });
};

// Not found handler
const notFoundHandler = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  
  res.status(404).json({
    success: false,
    message,
    statusCode: 404
  });
};

module.exports = {
  handleValidationErrors,
  globalErrorHandler,
  notFoundHandler
};
