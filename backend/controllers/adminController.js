// backend/controllers/adminController.js

const User = require('../models/user');
const Transaction = require('../models/transaction');
const News = require('../models/news');

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  if (username === 'kedimoneynetwork1' && password === 'kedimoney') {
    return res.status(200).json({ isAdmin: true });
  }
  return res.status(401).json({ message: 'Invalid admin credentials' });
};

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.approved = true;
    await user.save();
    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed', error });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'fullName email');
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

exports.postNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = new News({ title, content });
    await news.save();
    res.status(201).json({ message: 'News posted successfully', news });
  } catch (error) {
    res.status(500).json({ message: 'Error posting news', error });
  }
};

exports.getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};