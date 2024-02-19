const express = require('express');
const dbMiddleware = require('../../middleware/dbMiddleware')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../../middleware/authMiddleware');
const User = require('../models/Users');






//get user by email

router.get('/by-email/:email',dbMiddleware, async (req, res) => {
  const { usersCollection } = req.db;
  try {
    const user = await  User.findOne({ email });
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).send('Erreur lors de la récupération de l\'utilisateur.');
  }
});


// Connexion
router.post('/login', dbMiddleware, async (req, res) => {
  const { usersCollection } = req.db;
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
// Assurez-vous que c'est le bon nom de collection

    const searchedUser = await usersCollection.findOne({ email });


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
    res.cookie('authToken', token, {
      httpOnly: true, //
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'None', 
      maxAge: 3600000, 
    });

    // Send success response along with token
    res.status(200).json({ token: token, message: 'Successfully logged in.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error occurred during processing request.' });
  } 
});

module.exports = router;