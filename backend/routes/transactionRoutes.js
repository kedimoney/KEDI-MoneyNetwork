const express = require('express');
const router = express.Router();
const { makeDeposit } = require('../controllers/transactionController');

// Route yo kubitsa
router.post('/deposit', makeDeposit);

module.exports = router;
