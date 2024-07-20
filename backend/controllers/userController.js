const userDao = require('../dao/userDao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = 'mysecretkey'; // Toto by mělo být uloženo v prostředí (dotenv)

class UserController {
  async registerUser(req, res) {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userDao.createUser(username, hashedPassword);
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during registration' });
    }
  }

  async loginUser(req, res) {
    try {
      const { username, password } = req.body;
      const user = await userDao.findUserByUsername(username);
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred during login' });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userDao.findUserById(id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
  }
}

module.exports = new UserController();
