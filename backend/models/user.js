const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  district: { type: String, required: true },
  sector: { type: String, required: true },
  cell: { type: String, required: true },
  village: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  referralId: { type: String, unique: true },
  referrerId: { type: String }, // referralId of the referrer
  amount: { type: Number, default: 10100 },
  paymentMethod: { type: String, enum: ['mobile', 'bank'], required: true },
  txnId: { type: String, required: true },
  commissionsEarned: { type: Number, default: 0 } // commission balance
});

module.exports = mongoose.model('User', userSchema);
