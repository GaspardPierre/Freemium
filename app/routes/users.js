const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  // Implémentation de l'inscription
});

// Route pour la connexion
router.post('/login', async (req, res) => {
  // Implémentation de la connexion
});



module.exports = router;
