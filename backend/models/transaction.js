const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username
  type: { type: String, required: true }, // e.g. "deposit", "withdraw", "loan"
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  txnId: { type: String },
});

module.exports = mongoose.model('Transaction', transactionSchema);
