const User = require('../models/UserModel');
const Membership = require('../models/MembershipModel');
const logger = require('../logger'); // Import the logger

// Add or Update Membership for a Vendor
exports.addUpdateMembership = async (req, res) => {
  const { vendorId, type } = req.body;
  if (!vendorId || !type) {
    logger.warn('Vendor ID or type is missing');
    return res.status(400).json({ error: 'Vendor ID and type are required' });
  }

  try {
    // Check if the vendor exists
    const vendor = await User.findById(vendorId);
    if (!vendor || vendor.role !== 'Vendor') {
      logger.warn(`Vendor not found or not a vendor: ${vendorId}`);
      return res.status(404).json({ error: 'Vendor not found' });
    }

    // Create or update membership
    const membership = await Membership.findOneAndUpdate(
      { vendor: vendorId },
      { type, validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },  // 1-year validity
      { new: true, upsert: true } // Create new if doesn't exist
    );

    logger.info(`Membership added/updated for vendor: ${vendorId}`);
    res.status(200).json(membership);
  } catch (error) {
    logger.error(`Failed to add/update membership: ${error.message}`);
    res.status(500).json({ error: 'Failed to add/update membership' });
  }
};

// Manage User (Add, Update, Delete)
exports.manageUser = async (req, res) => {
  const { userId, action, data } = req.body;
  if (!userId || !action) {
    logger.warn('User ID or action is missing');
    return res.status(400).json({ error: 'User ID and action are required' });
  }

  try {
    if (action === 'delete') {
      await User.findByIdAndDelete(userId);
      logger.info(`User deleted: ${userId}`);
      res.status(200).json({ message: 'User deleted successfully' });
    } else if (action === 'update') {
      const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
      logger.info(`User updated: ${userId}`);
      res.status(200).json(updatedUser);
    } else {
      logger.warn(`Invalid action: ${action}`);
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    logger.error(`Failed to manage user: ${error.message}`);
    res.status(500).json({ error: 'Failed to manage user' });
  }
};

// Manage Vendor (Add, Update, Delete)
exports.manageVendor = async (req, res) => {
  const { vendorId, action, data } = req.body;
  if (!vendorId || !action) {
    logger.warn('Vendor ID or action is missing');
    return res.status(400).json({ error: 'Vendor ID and action are required' });
  }

  try {
    if (action === 'delete') {
      await User.findByIdAndDelete(vendorId);
      logger.info(`Vendor deleted: ${vendorId}`);
      res.status(200).json({ message: 'Vendor deleted successfully' });
    } else if (action === 'update') {
      const updatedVendor = await User.findByIdAndUpdate(vendorId, data, { new: true });
      logger.info(`Vendor updated: ${vendorId}`);
      res.status(200).json(updatedVendor);
    } else {
      logger.warn(`Invalid action: ${action}`);
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    logger.error(`Failed to manage vendor: ${error.message}`);
    res.status(500).json({ error: 'Failed to manage vendor' });
  }
};