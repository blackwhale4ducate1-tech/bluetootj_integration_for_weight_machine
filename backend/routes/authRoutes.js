const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');

const { authMiddleware } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/errorHandler');

const {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate,
  validatePasswordChange
} = require('../utils/validators');

// Public routes
router.post('/register', validateUserRegistration, handleValidationErrors, register);
router.post('/login', validateUserLogin, handleValidationErrors, login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, validateUserProfileUpdate, handleValidationErrors, updateProfile);
router.post('/change-password', authMiddleware, validatePasswordChange, handleValidationErrors, changePassword);
router.post('/logout', authMiddleware, logout);

module.exports = router;
