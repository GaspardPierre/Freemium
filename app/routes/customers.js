
const express = require('express');
const Customer = require('../models/Customer');
const router = express.Router();

// Route pour ajouter un nouveau client
router.post('/', async (req, res) => {
  try {
    const { name, email, image_url } = req.body;
    const newCustomer = new Customer({ name, email, image_url });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route pour récupérer tous les clients
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({});
    res.json(customers);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
