const User = require('../models/UserModel');
const Membership = require('../models/MembershipModel');

// Add or Update Membership for a Vendor
exports.addUpdateMembership = async (req, res) => {
  const { vendorId, type } = req.body;
  try {
    // Check if the vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'Vendor') return res.status(404).json({ error: 'Vendor not found' });

    // Create or update membership
    const membership = await Membership.findOneAndUpdate(
      { vendor: vendorId },
      { type, validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },  // 1-year validity
      { new: true, upsert: true } // Create new if doesn't exist
    );

    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add/update membership' });
  }
};

// Manage User (Add, Update, Delete)
exports.manageUser = async (req, res) => {
  const { userId, action, data } = req.body;
  try {
    if (action === 'delete') {
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } else if (action === 'update') {
      const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to manage user' });
  }
};

// Manage Vendor (Add, Update, Delete)
exports.manageVendor = async (req, res) => {
  const { vendorId, action, data } = req.body;
  try {
    if (action === 'delete') {
      await User.findByIdAndDelete(vendorId);
      res.status(200).json({ message: 'Vendor deleted successfully' });
    } else if (action === 'update') {
      const updatedVendor = await User.findByIdAndUpdate(vendorId, data, { new: true });
      res.status(200).json(updatedVendor);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to manage vendor' });
  }
};
