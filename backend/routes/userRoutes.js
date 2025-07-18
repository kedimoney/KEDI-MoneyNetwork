// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// User Dashboard/Profile
router.get('/dashboard', userController.dashboard);
router.get('/profile', userController.getProfile);

module.exports = router;
