const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  user: { type: String, required: true }, // username who earned commission
  fromUser: { type: String, required: true }, // username who generated commission (referral)
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Commission', commissionSchema);
