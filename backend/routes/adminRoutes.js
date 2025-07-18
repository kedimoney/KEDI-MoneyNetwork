// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', adminController.adminLogin);

// Users pending approval
router.get('/pending-users', adminController.getPendingUsers);

// Approve user
router.post('/approve-user/:id', adminController.approveUser);

// Get all transactions
router.get('/all-transactions', adminController.getAllTransactions);

// Post news
router.post('/news', adminController.postNews);

// Get news
router.get('/news', adminController.getNews);

module.exports = router;
