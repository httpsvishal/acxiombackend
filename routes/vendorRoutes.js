const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { verifyVendor } = require('../middlewares/authMiddleware');

// Add a new item
router.post('/item', verifyVendor, vendorController.addItem);

// Update an item
router.put('/item', verifyVendor, vendorController.updateItem);

// Delete an item
router.delete('/item', verifyVendor, vendorController.deleteItem);

// View transactions for a vendor
router.get('/transactions', verifyVendor, vendorController.viewTransactions);

module.exports = router;
