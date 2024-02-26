const express = require('express');
const router = express.Router();
const Revenue = require('../models/Revenue')
const dbMiddleware = require('../../middleware/dbMiddleware');

router.get('/', dbMiddleware, async (req, res) => {
  try {
    const { revenuesCollection } = req.db;
    const revenueData = await revenuesCollection.find({}).toArray(); 
 
    res.json(revenueData);
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/addRevenue', async (req, res) => {
  try {
    const newRevenue = new Revenue({
      month: req.body.month,
      revenue: req.body.revenue
    });
    const result = await newRevenue.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send('Erreur de serveur: ' + error.message);
  }
});

module.exports = router;
