const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router.post('/add', cartController.addItemToCart);
router.get('/:userId', cartController.getCart); // Route to get cart details
router.post('/remove', cartController.removeItemFromCart);

module.exports = router;