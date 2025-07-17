const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  paymentMethod: String,
  transactionId: String,
  approved: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
