// backend/controllers/userController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id, isAdmin = false) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// User Signup
exports.signup = async (req, res) => {
  const { fullName, email, password, phone, paymentMethod, txnId } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      paymentMethod,
      txnId,
      isApproved: false,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered, awaiting approval' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isApproved) return res.status(403).json({ message: 'Wait for approval' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, fullName: user.fullName, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
