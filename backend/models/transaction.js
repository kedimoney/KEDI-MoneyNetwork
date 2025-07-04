const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: String, required: true },       // Username cyangwa user ID
  type: { type: String, required: true },       // Urugero: "deposit", "withdrawal", "loan"
  amount: { type: Number, required: true },     // Amafaranga yoherejwe cyangwa yakiriwe
  description: { type: String },                 // Ibisobanuro (optional)
  date: { type: Date, default: Date.now },      // Itariki y'igikorwa
  status: { type: String, default: "pending" }, // Status y'igikorwa: "pending", "approved", "rejected"
});

module.exports = mongoose.model('Transaction', transactionSchema);
