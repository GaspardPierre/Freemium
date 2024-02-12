const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Customer = require('./Customer');

const invoiceSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [new Schema({ description: String,
     hours: Number,
      rate: Number })],
  amount: Number,
  date: { type: Date, default: Date.now },
  dueDate: Date,
  status: { type: String, enum: ['draft', 'pending', 'paid'], default: 'Draft' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
