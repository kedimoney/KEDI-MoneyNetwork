const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/user');
const Transaction = require('./models/transaction');

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 👉 Serve frontend static files (frontend folder is outside backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Generate referral ID
function generateReferralID() {
  return `KEDI${Math.floor(10000 + Math.random() * 90000)}RW`;
}

// ✅ Signup Route
app.post('/api/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'paymentScreenshot', maxCount: 1 },
]), async (req, res) => {
  try {
    const {
      firstName, lastName, district, sector, cell, village,
      idNumber, username, password, referralId,
      referrerFirstName, referrerLastName,
    } = req.body;

    const files = req.files;
    if (!files.profilePhoto || !files.idFront || !files.idBack || !files.paymentScreenshot) {
      return res.status(400).json({ message: 'All image files are required.' });
    }

    const newUser = new User({
      firstName, lastName, district, sector, cell, village,
      idNumber, username, password,
      referralId: referralId || generateReferralID(),
      referrerFirstName, referrerLastName,
      profilePhoto: files.profilePhoto[0].path,
      idFront: files.idFront[0].path,
      idBack: files.idBack[0].path,
      paymentScreenshot: files.paymentScreenshot[0].path,
      amount: 10100,
      status: 'pending',
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!', referralId: newUser.referralId });

  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// ✅ Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    res.json({ success: true, message: 'Login successful.' });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ✅ Submit Transaction
app.post('/api/submit', upload.none(), async (req, res) => {
  try {
    const data = req.body;
    const newTransaction = new Transaction({
      ...data,
      date: new Date(),
    });
    await newTransaction.save();
    res.json({ success: true, message: 'Transaction saved.' });
  } catch (err) {
    console.error('❌ Transaction error:', err);
    res.status(500).json({ success: false, message: 'Server error during transaction.' });
  }
});

// ✅ Get Transaction History
app.get('/api/history', async (req, res) => {
  try {
    const user = req.query.user;
    if (!user) return res.status(400).json({ message: 'User query param required' });

    const history = await Transaction.find({ user }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error('❌ History error:', err);
    res.status(500).json({ message: 'Server error fetching history.' });
  }
});

// ✅ API Test
app.get('/api', (req, res) => {
  res.send('✅ API is working');
});

// ✅ Catch-all route to serve frontend (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
