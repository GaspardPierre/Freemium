const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send(error);
    }
  };
  
  // Logique pour la connexion de l'utilisateur
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Authentication failed');
      }
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  