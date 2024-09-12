const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Vendor', 'User'], default: 'User' },
  membership: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership' },
  category: { type: String, required: function() { return this.role === 'Admin'; } } // Add category field conditionally
});

userSchema.pre('save', function(next) {
  if (this.role !== 'Admin') {
    this.category = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);