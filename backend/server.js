const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import database and models
const { testConnection } = require('./config/database');
const { syncDatabase } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const weightRoutes = require('./routes/weightRoutes');

// Import middlewares
const { globalErrorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Initialize Express app
const app = express();

// Get port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bluetooth Weight Scale API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/weight', weightRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Bluetooth Weight Scale API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      weight: '/api/weight',
      health: '/health'
    },
    documentation: 'See README.md for API documentation'
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Note: Database tables should be created using migrations
    // Run: npm run migrate
    console.log('📊 Database connected. Use "npm run migrate" to create/update tables');
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📱 API Base URL: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      
      server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Close database connection
        const { sequelize } = require('./config/database');
        sequelize.close().then(() => {
          console.log('✅ Database connection closed');
          process.exit(0);
        }).catch((error) => {
          console.error('❌ Error closing database connection:', error);
          process.exit(1);
        });
      });
    };

    // Handle process termination
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
