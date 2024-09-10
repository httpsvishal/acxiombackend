const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

// Add or Update Membership for a Vendor
router.post('/membership', verifyAdmin, adminController.addUpdateMembership);

// Manage Users (Add, Update, Delete)
router.post('/user', verifyAdmin, adminController.manageUser);

// Manage Vendors (Add, Update, Delete)
router.post('/vendor', verifyAdmin, adminController.manageVendor);

module.exports = router;