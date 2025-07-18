// controllers/userController.js

exports.signup = (req, res) => {
  res.status(200).json({ message: 'Signup route is working' });
};

exports.login = (req, res) => {
  res.status(200).json({ message: 'Login route is working' });
};

exports.getProfile = (req, res) => {
  res.status(200).json({ message: 'User profile data' });
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.dashboard = (req, res) => {
  res.status(200).json({ message: 'Dashboard route' });
};
