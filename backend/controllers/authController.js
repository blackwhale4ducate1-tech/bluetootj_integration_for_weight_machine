const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { generateToken } = require('../utils/jwtHelper');

// Register new user
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, height, dateOfBirth, gender } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        statusCode: 409
      });
    }

    // Create new user (password will be hashed by the model hook)
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      height,
      dateOfBirth,
      gender
    });

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });

    // Return user data without password
    const userData = user.toSafeObject();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        ...userData,
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        statusCode: 401
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        statusCode: 401
      });
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });

    // Return user data without password
    const userData = user.toSafeObject();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res, next) => {
  try {
    // User is already attached to req by auth middleware
    const userData = req.user.toSafeObject();

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: userData
    });

  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, firstName, lastName, height, dateOfBirth, gender } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists',
          statusCode: 409
        });
      }
    }

    // Update user
    const [updatedRowsCount] = await User.update(
      {
        ...(email && { email }),
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(height !== undefined && { height }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(gender !== undefined && { gender })
      },
      {
        where: { id: userId },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        statusCode: 404
      });
    }

    // Get updated user
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    const userData = updatedUser.toSafeObject();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });

  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        statusCode: 404
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        statusCode: 400
      });
    }

    // Update password (will be hashed by model hook)
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Logout (client-side token removal)
const logout = async (req, res, next) => {
  try {
    // Since we're using stateless JWT, logout is handled client-side
    // This endpoint is mainly for consistency and potential future token blacklisting
    res.json({
      success: true,
      message: 'Logged out successfully. Please remove the token from client storage.'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};
