const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, paymentMethod, transactionId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      paymentMethod,
      transactionId,
      approved: false, // Wait for admin approval
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful. Please wait for admin approval.' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.approved) return res.status(403).json({ message: 'Account not approved yet' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
