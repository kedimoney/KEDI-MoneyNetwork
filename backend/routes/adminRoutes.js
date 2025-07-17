// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  adminLogin,
  approveUser,
  getAllUsers,
  getAllTransactions,
  postNewsUpdate,
  getNews,
} = require('../controllers/adminController');
const { adminOnly } = require('../middleware/authMiddleware');

router.post('/login', adminLogin);
router.post('/approve-user', adminOnly, approveUser);
router.get('/users', adminOnly, getAllUsers);
router.get('/transactions', adminOnly, getAllTransactions);
router.post('/news', adminOnly, postNewsUpdate);
router.get('/news', getNews); // Public

module.exports = router;
