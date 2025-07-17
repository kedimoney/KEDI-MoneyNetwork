// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User signup
router.post('/signup', userController.signup);

// User login
router.post('/login', userController.login);

// Get current logged in user profile
router.get('/profile', authMiddleware, userController.getProfile);

// Get user tree (downline)
router.get('/tree/:userId', authMiddleware, userController.getUserTree);

module.exports = router;
