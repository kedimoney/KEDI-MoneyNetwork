const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// POST: Create new transaction
router.post('/submit', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Transaction submission failed', details: err.message });
  }
});

module.exports = router;
