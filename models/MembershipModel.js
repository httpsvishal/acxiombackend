const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['Basic', 'Premium'] },
  validUntil: Date
});

module.exports = mongoose.model('Membership', membershipSchema);