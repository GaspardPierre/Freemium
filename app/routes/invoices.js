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

    const invoices = await Invoices.find({})
    .sort({ date: -1 })

    const latestInvoices = await Invoices.find({})
      .sort({ date: -1 })
      .limit(5)
      .populate('customer_id', ['name', 'email' ,'image_url']);


    if (latestInvoices && latestInvoices.length > 0) {
      latestInvoices.forEach((invoice, index) => {
      
      });
    }

    res.json(latestInvoices);
  } catch (error) {
    console.error('Erreur lors de la récupération des dernières factures:', error);
    res.status(500).send('Erreur lors de la récupération des dernières factures.');
  }
});

router.get('/search', dbMiddleware, async (req, res) => {

  try {
    const query = req.query.search;
    let queryConditions = [
      { 'customer.name': { $regex: query, $options: 'i' } },
      { 'customer.email': { $regex: query, $options: 'i' } },
      { 'status': { $regex: query, $options: 'i' } },
    ];

    // Gérer les chiffres différemment
    if (!isNaN(query)) {
      queryConditions.push({ 'amount': Number(query) });
    }
    if (Date.parse(query)) {
      const dateQuery = new Date(query);
      queryConditions.push({ 'date': { $gte: dateQuery, $lte: new Date(dateQuery.getTime() + 86400000) } });
    }

    const count = await Invoices.find({ $or: queryConditions }).countDocuments();
    res.json({ totalPages: Math.ceil(count / ITEMS_PER_PAGE) });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de factures:', error);
    res.status(500).send('Erreur lors de la récupération du nombre de factures.');
  }
});

const ITEMS_PER_PAGE = 6;

router.get('/filtered', dbMiddleware, async (req, res) => {
  console.log("Request !!!!!!!! " + req)
  const { invoicesCollection } = req.db;
  try {
    const { query = '', page = 1 } = req.query; // Valeurs par défaut si non définies
    const offset = (page - 1) * ITEMS_PER_PAGE;


    let matchConditions = [];
    const aggregateConditions = [
      { $lookup: { from: 'customers', localField: 'customer_id', foreignField: '_id', as: 'customer' } },
      { $unwind: '$customer' },
      ...(matchConditions.length ? [{ $match: { $or: matchConditions } }] : []),
      { $sort: { date: -1 } },
      { $skip: offset },
      { $limit: ITEMS_PER_PAGE }
    ];

    if (query) {
      matchConditions.push(
        { 'customer.name': { $regex: query, $options: 'i' } },
        { 'customer.email': { $regex: query, $options: 'i' } },
        { 'status': { $regex: query, $options: 'i' } }
      );

    // Gérer les chiffres pour le champ 'amount'
    if (!isNaN(query)) {
      matchConditions.push({ 'amount': Number(query) });
    }

    // Gérer les dates pour le champ 'date'
    if (Date.parse(query)) {
      const dateQuery = new Date(query);
      matchConditions.push({ 'date': { $gte: dateQuery, $lte: new Date(dateQuery.getTime() + 86400000) } });
    }
     aggregateConditions.splice(3, 0, { $match: { $or: matchConditions } });
  }

    const invoices = await Invoices.aggregate(aggregateConditions);
    res.json(invoices);
  } catch (error) {
    console.error('Erreur lors de la récupération des factures filtrées:', error);
    res.status(500).send('Erreur lors de la récupération des factures filtrées.');
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
