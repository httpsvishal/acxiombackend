const Cart = require('../models/cartModel');
const Item = require('../models/ItemModel');
const logger = require('../logger'); // Import the logger

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId });

    // If no cart exists, create a new one
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the item already exists in the cart
    const itemIndex = cart.items.findIndex(item => item.item.toString() === itemId);

    if (itemIndex > -1) {
      // If the item exists, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // If the item does not exist, add it to the cart
      cart.items.push({ item: itemId, quantity });
    }

    // Save the cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    logger.error(`Error adding item to cart: ${error.message}`);
    res.status(500).json({ error: 'Server error adding item to cart' });
  }
};

// Get cart for a user
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.item');
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    logger.error(`Error fetching cart: ${error.message}`);
    res.status(500).json({ error: 'Server error fetching cart' });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.item.toString() !== itemId);

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    logger.error(`Error removing item from cart: ${error.message}`);
    res.status(500).json({ error: 'Server error removing item from cart' });
  }
};