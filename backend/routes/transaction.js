const express = require('express');
const router = express.Router();
const { saveTransaction, getUserTransactions } = require('../controllers/transactionController');

router.post('/submit', saveTransaction);
router.get('/:userId', getUserTransactions);

module.exports = router;
