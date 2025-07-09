require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');

const User = require('./models/user');
const Transaction = require('./models/transaction');
const Commission = require('./models/commission');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route for Render
app.get('/', (req, res) => {
  res.send('✅ KEDI Money Network API is live.');
});

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Helper to generate unique referralId (simple example)
function generateReferralId(username) {
  return username + Math.floor(1000 + Math.random() * 9000);
}

// --- Signup route ---
app.post('/api/signup', async (req, res) => {
  try {
    const {
      firstName, lastName, district, sector, cell, village,
      idNumber, username, password, referralId,
      amount, paymentMethod, txnId
    } = req.body;

    if (!firstName || !lastName || !district || !sector || !cell || !village ||
      !idNumber || !username || !password || !paymentMethod || !txnId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await User.findOne({ $or: [{ username }, { idNumber }] });
    if (userExists) return res.status(409).json({ message: "Username or ID Number already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newReferralId = generateReferralId(username);

    // Find referrer if referralId is provided
    let referrer = null;
    if (referralId) {
      referrer = await User.findOne({ referralId });
    }

    const newUser = new User({
      firstName, lastName, district, sector, cell, village,
      idNumber, username, password: hashedPassword,
      referralId: newReferralId,
      referrerId: referrer ? referrer.referralId : null,
      amount,
      paymentMethod,
      txnId,
      commissionsEarned: 0
    });

    await newUser.save();

    // Give commission to referrer (e.g. 10% of amount)
    if (referrer) {
      const commissionAmount = amount * 0.10;

      // Update referrer commission balance
      referrer.commissionsEarned += commissionAmount;
      await referrer.save();

      // Save commission record
      const commissionRecord = new Commission({
        user: referrer.username,
        fromUser: username,
        amount: commissionAmount,
      });
      await commissionRecord.save();
    }

    res.json({ success: true, referralId: newReferralId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// --- Login route ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Missing username or password" });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// --- Submit transaction ---
app.post('/api/submit', async (req, res) => {
  try {
    const { user, type, amount, txnId } = req.body;
    if (!user || !type || !amount) {
      return res.status(400).json({ message: "Missing transaction data" });
    }
    const newTxn = new Transaction({
      user, type, amount: Number(amount), txnId
    });
    await newTxn.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error during transaction submit" });
  }
});

// --- Transaction history ---
app.get('/api/history', async (req, res) => {
  try {
    const user = req.query.user;
    if (!user) return res.status(400).json({ message: "User query required" });
    const history = await Transaction.find({ user }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching history" });
  }
});

// --- Commissions info ---
app.get('/api/commissions', async (req, res) => {
  try {
    const username = req.query.user;
    if (!username) return res.status(400).json({ message: "User query required" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const commissions = await Commission.find({ user: username }).sort({ date: -1 });

    res.json({
      totalCommissions: user.commissionsEarned,
      commissions
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching commissions" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
