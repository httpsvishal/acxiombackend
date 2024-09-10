const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  totalAmount: Number,
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Card', 'Cash', 'Online'] }
});

module.exports = mongoose.model('Transaction', transactionSchema);