const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Vendor', 'User'], default: 'User' },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' }
});

module.exports = mongoose.model('User', userSchema);