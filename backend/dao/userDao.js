const User = require('../models/user');

class UserDao {
  async createUser(username, password) {
    const newUser = new User({ username, password });
    return await newUser.save();
  }

  async findUserByUsername(username) {
    return await User.findOne({ username }).populate('lists');
  }

  async findUserById(id) {
    return await User.findById(id).populate('lists');
  }
}

module.exports = new UserDao();
