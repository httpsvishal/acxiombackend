const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Vendor who added the item
  status: { type: String, enum: ['Available', 'Out of Stock'] }
});

module.exports = mongoose.model('Item', itemSchema);