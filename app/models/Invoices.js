const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const Customer = require('./Customer');

const invoiceSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  items: [new Schema({ description: String,
     hours: Number,
      rate: Number })],
      amount: {
        type: Number,
        required: true,
        validate: {
          validator: function(v) {
            return !isNaN(v);
          },
          message: props => `${props.value} n'est pas un nombre valide!`
        }
      },
  date: { type: Date, default: Date.now },
  dueDate: Date,
  status: { type: String, enum: ['draft', 'pending', 'paid'], default: 'Draft' }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
