const express = require('express');
const router = express.Router();
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

module.exports = router;
