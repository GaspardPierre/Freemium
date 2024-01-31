const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    description: String,
    hours: Number,
    rate: Number
  }],
  issueDate: { type: Date, default: Date.now },
  dueDate: Date,
  status: { type: String, enum: ['Draft', 'Sent', 'Paid'], default: 'Draft' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
