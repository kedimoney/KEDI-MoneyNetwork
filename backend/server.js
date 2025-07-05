const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const User = require('./models/user');
const Transaction = require('./models/transaction');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Generate Referral ID
function generateReferralID() {
  return `KEDI${Math.floor(10000 + Math.random() * 90000)}RW`;
}

// SIGNUP Route (for tree.html or signup.html)
app.post('/api/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'paymentScreenshot', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      firstName, lastName, district, sector, cell, village,
      idNumber, username, password, referralId,
      referrerFirstName, referrerLastName, amount
    } = req.body;

    const files = req.files;
    if (!files.profilePhoto || !files.idFront || !files.idBack || !files.paymentScreenshot) {
      return res.status(400).json({ message: 'All image files are required.' });
    }

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username already exists.' });

    const newUser = new User({
      firstName, lastName, district, sector, cell, village, idNumber,
      username, password, referralId: referralId || generateReferralID(),
      referrerFirstName, referrerLastName, amount,
      profilePhoto: files.profilePhoto[0].path,
      idFront: files.idFront[0].path,
      idBack: files.idBack[0].path,
      paymentScreenshot: files.paymentScreenshot[0].path,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', referralId: newUser.referralId });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// LOGIN Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }); // NB: Hashing should be used
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    res.status(200).json({ success: true, message: 'Login successful', user });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// TRANSACTION submission route (kubitsa, kubikuza, kugurizwa)
app.post('/api/submit', upload.none(), async (req, res) => {
  try {
    const data = req.body;
    const newTransaction = new Transaction(data);
    await newTransaction.save();
    res.status(201).json({ success: true, message: 'Transaction submitted!' });
  } catch (err) {
    console.error('❌ Transaction error:', err);
    res.status(500).json({ success: false, message: 'Failed to save transaction' });
  }
});

// History route
app.get('/api/history', async (req, res) => {
  try {
    const user = req.query.user;
    const history = await Transaction.find({ user }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('❌ History fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

// API test
app.get('/api', (req, res) => {
  res.send('✅ API is working');
});

// Serve frontend fallback (Single Page App support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

