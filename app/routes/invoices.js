const express = require('express');
const Invoices = require('../models/Invoices');
const router = express.Router();

// Route pour obtenir les  5 dernières factures
router.get('/latest', async (req, res) => {
    try {
      const latestInvoices = await Invoices.find({})
        .sort({ date: -1 })
        .limit(5)
        .populate('customer', ['name', 'image_url', 'email']);
      res.json(latestInvoices);
    } catch (error) {
      res.status(500).send('Erreur lors de la récupération des dernières factures.');
    }
  });
  



router.post('/', async (req, res) => {

});


router.get('/', async (req, res) => {

});



module.exports = router;
