const express = require('express');
const dbMiddleware = require('../../middleware/dbMiddleware');
const Invoices = require('../models/Invoices');
const Customer = require('../models/Customer');
const router = express.Router();
const { ObjectId } = require('mongodb');
const auth = require('../../middleware/authMiddleware');





// Route pour obtenir les  5 dernières factures

router.get('/latest', async (req, res) => {

  try { 
    console.log("Début de la récupération des dernières factures");
    const invoices = await Invoices.find({})
    .sort({ date: -1 })
console.log("*********INVOICES***************", invoices);
    const latestInvoices = await Invoices.find({})
      .sort({ date: -1 })
      .limit(5)
      .populate('customer_id', ['name', 'email' ,'image_url']);

    console.log("Invoices récupérées:", latestInvoices);

    if (latestInvoices && latestInvoices.length > 0) {
      latestInvoices.forEach((invoice, index) => {
        console.log(`Facture ${index + 1}: `, invoice);
        console.log(`Customer ID ${index + 1}: `, invoice.customer_id);
      });
    }

    res.json(latestInvoices);
  } catch (error) {
    console.error('Erreur lors de la récupération des dernières factures:', error);
    res.status(500).send('Erreur lors de la récupération des dernières factures.');
  }
});

  router.get('/search', dbMiddleware, async (req, res) => {
   const { invoicesCollection, customerCollection} = req.db;
    try {
      const query = req.query.search;
      const count = await invoicesCollection.find({
        // Utilisez un filtre pour rechercher dans différents champs
        $or: [
          { 'customer.name': { $regex: query, $options: 'i' } },
          { 'customer.email': { $regex: query, $options: 'i' } },
          { 'amount': { $regex: query, $options: 'i' } },
          { 'date': { $regex: query, $options: 'i' } },
          { 'status': { $regex: query, $options: 'i' } },
        ]
      }).countDocuments();
  
      res.json({ totalPages: Math.ceil(count / ITEMS_PER_PAGE) });
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de factures:', error);
      res.status(500).send('Erreur lors de la récupération du nombre de factures.');
    }
  });
  // get invoice by id

  router.get('/:id', dbMiddleware, async (req, res) => {
    const { invoicesCollection } = req.db;
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Identifiant non valide.');
      }
      const invoiceId = new ObjectId(req.params.id);
      const invoice = await invoicesCollection.findOne({ _id: invoiceId });
  
      if (!invoice) {
        return res.status(404).send('Facture non trouvée.');
      }
      res.json(invoice);
    } catch (error) {
      console.error('Erreur lors de la récupération de la facture:', error);
      res.status(500).send('Erreur lors de la récupération de la facture.');
    }
  });

  //get all invoices filtered
  const ITEMS_PER_PAGE = 6;

  router.get('/filtered', dbMiddleware, async (req, res) => {

  const { invoicesCollection, customerCollection } = req.db;
    try {
      const { query, page } = req.query;
      const offset = (page - 1) * ITEMS_PER_PAGE;
  
      const invoices = await invoicesCollection.aggregate([
        {
          $lookup: {
            from: 'customers',
            localField: 'customer_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        { $unwind: '$customer' },
        {
          $match: {
            $or: [
              { 'customer.name': { $regex: query, $options: 'i' } },
              { 'customer.email': { $regex: query, $options: 'i' } },
              { 'amount': { $regex: query, $options: 'i' } },
              { 'date': { $regex: query, $options: 'i' } },
              { 'status': { $regex: query, $options: 'i' } }
            ]
          }
        },
        { $sort: { date: -1 } },
        { $skip: offset },
        { $limit: ITEMS_PER_PAGE }
      ]);
  
      res.json(invoices);
    } catch (error) {
      console.error('Erreur lors de la récupération des factures filtrées:', error);
      res.status(500).send('Erreur lors de la récupération des factures filtrées.');
    }
  });
  
  
  // Route for the total number of invoices
router.get('/count', dbMiddleware, async (req, res) => {
  console.log("requête reçue...", req)
  const { invoicesCollection } = req.db;
  try {
    const count = await Invoices.countDocuments();
    console.log(count, "*****COUNT*** DANS INVOICES***")
    res.json({ count });
  } catch (error) {
    res.status(500).send('Erreur de serveur');
  }
});

// Route for the paid and pending invoices
router.get('/amounts',dbMiddleware,async (req, res) => {
 const { invoicesCollection } = req.db;
  try {
    const result = await invoicesCollection.aggregate([
      {
        $group: {
          _id: null,
          paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } }
        }
      }
    ]);
    console.log("RESULT : " + result[0])
    res.json(result[0]);
  } catch (error) {
    res.status(500).send('Erreur de serveur');
  }
});




module.exports = router;
