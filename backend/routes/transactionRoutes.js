// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  deposit,
  withdraw,
  requestLoan,
  getUserTransactions,
} = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/loan', protect, requestLoan);
router.get('/history', protect, getUserTransactions);

module.exports = router;
