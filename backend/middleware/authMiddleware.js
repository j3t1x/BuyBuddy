const User = require('../models/user');

const userMiddleware = async (req, res, next) => {
  try {
    const userId = req.headers['userid'];
    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = userMiddleware;
