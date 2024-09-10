const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser } = require('../middlewares/authMiddleware');

// View available items
router.get('/items', verifyUser, userController.viewItems);

// Add items to cart
router.post('/cart', verifyUser, userController.addToCart);

// View order status
router.get('/order-status', verifyUser, userController.viewOrderStatus);

// Cancel an order
router.put('/cancel-order', verifyUser, userController.cancelOrder);

module.exports = router;
