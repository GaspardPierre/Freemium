const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoDB_URI = process.env.MONGODB_URI;
const auth = require('../../middleware/authMiddleware');

// MongoDB URI and client setup
const uri = mongoDB_URI;
const client = new MongoClient(uri);

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    await client.connect();
    const database = client.db("freemium");
    const users = database.collection("users"); // Assurez-vous que c'est le bon nom de collection

    const searchedUser = await users.findOne({ email });

console.log(searchedUser,"SearchUser");
    if (!searchedUser) {
      return res.status(401).json({ message: "Unauthorized access. Please sign up first." });
    }
   

    const isPasswordValid = await bcrypt.compare(password, searchedUser.password);

    if (!isPasswordValid) {
    
      return res.status(401).json({ message: "Unauthorized access. Invalid email or password." });
    }

    // Generate JSON Web Token
    const token = jwt.sign(
      { userId: searchedUser._id, email: searchedUser.email },
      process.env.AUTH_SECRET,
      { expiresIn: '1h' }
    );

    // Send success response along with token
    res.status(200).json({ token: token, message: 'Successfully logged in.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error occurred during processing request.' });
  } finally {
    await client.close();
  }
});

module.exports = router;