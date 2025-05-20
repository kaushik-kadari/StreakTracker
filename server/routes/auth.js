const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Update user profile (protected route)
router.put('/profile', auth, authController.updateProfile);

// Get current user data (protected route)
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
