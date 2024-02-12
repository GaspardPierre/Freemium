const express = require('express');
const router = express.Router();
const Invoices = require('../models/Invoices');
const Customer = require('../models/Customer');


router.get('/', async (req, res) => {

    try {
      const invoicesCount = await Invoices.countDocuments();
      console.log(invoicesCount.toString)
      const customersCount = await Customer.countDocuments();
      const invoiceAmounts = await Invoices.aggregate([
        {
          $group: {
            _id: null,
            paid: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
            pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } }
          }
        }
      ]);
  
      res.json({
        numberOfInvoices: invoicesCount,
        numberOfCustomers: customersCount,
        totalPaidInvoices: invoiceAmounts[0]?.paid || 0,
        totalPendingInvoices: invoiceAmounts[0]?.pending || 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des données du tableau de bord:', error);
      res.status(500).send('Erreur de serveur');
    }
  });
  
  module.exports = router;