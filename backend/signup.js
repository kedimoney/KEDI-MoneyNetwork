const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Helper function yo gukora Referral ID
function generateReferralId() {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // ex: 1234
  return `KEDI${randomNum}RW${Date.now().toString().slice(-3)}`;
}

// POST /api/signup (ikoresha JSON)
router.post('/signup', async (req, res) => {
  try {
    const {
      firstName, lastName, district, sector, cell, village,
      idNumber, amount, username, password,
      referralId, referrerFirstName, referrerLastName,
      paymentMethod, txnId
    } = req.body;

    // ✔️ Basic validation
    if (!firstName || !lastName || !idNumber || !username || !password || !paymentMethod || !txnId) {
      return res.status(400).json({ message: "Fields z'ingenzi zirabura." });
    }

    // ✔️ Reba niba username isanzwe
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Username irakoreshwa." });
    }

    // ✔️ Bika umu user
    const newUser = new User({
      firstName,
      lastName,
      district,
      sector,
      cell,
      village,
      idNumber,
      amount,
      username,
      password,
      referralId: referralId || generateReferralId(),
      referrerFirstName,
      referrerLastName,
      paymentMethod,
      txnId,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      referralId: newUser.referralId,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
