

const express = require('express');
const dbMiddleware = require('../../middleware/dbMiddleware');
const Customer = require('../models/Customer');
const Invoices = require('../models/Invoices');
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

// get all customers
router.get('/',dbMiddleware, async (req, res) => {
  const { customerCollection } = req.db;
  try {
    const customers = await customerCollection.find().sort({ name: 1 }).toArray(); ;
    res.json(customers);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).send('Erreur lors de la récupération des clients.');
  }
});



router.get('/filtered', dbMiddleware, async (req, res) => {
  const { customerCollection, InvoicesCollection } = req.db;
  try {
    const query = req.query.search;
    const customers = await customerCollection.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'customer_id',
          as: 'invoices'
        }
      },
      {
        $unwind: {
          path: '$invoices',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          image_url: { $first: '$image_url' },
          total_invoices: { $sum: 1 },
          total_pending: { $sum: { $cond: [{ $eq: ['$invoices.status', 'pending'] }, '$invoices.amount', 0] } },
          total_paid: { $sum: { $cond: [{ $eq: ['$invoices.status', 'paid'] }, '$invoices.amount', 0] } }
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    res.json(customers);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients filtrés:', error);
    res.status(500).send('Erreur lors de la récupération des clients filtrés.');
  }
});



// Route for the total number of customers
router.get('/count', dbMiddleware, async (req, res) => {
 const { customerCollection } = req.db;
 
  try {
    const count = await customerCollection.countDocument();
    console.log("COUNT : " + count);
    res.json({ count });
  } catch (error) {
    res.status(500).send('Erreur de serveur');
  }
});

module.exports = router;
