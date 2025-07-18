const User = require('../models/user');
const Transaction = require('../models/transaction');

// Kubitsa amafaranga
const makeDeposit = async (req, res) => {
  try {
    const { userId, amount, method, txnId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transaction = new Transaction({
      user: userId,
      amount,
      type: 'deposit',
      method,
      txnId,
      status: 'pending'
    });

    await transaction.save();
    res.status(201).json({ message: 'Deposit created, pending approval', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Export all functions
module.exports = {
  makeDeposit,
};
