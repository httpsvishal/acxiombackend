const Item = require('../models/ItemModel');
const Transaction = require('../models/TransactionModel');

// View available items (can be filtered by vendor)
exports.viewItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'Available' });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve items' });
  }
};

// Add items to Cart (Create a Transaction)
exports.addToCart = async (req, res) => {
  const { itemIds, paymentMethod } = req.body;
  try {
    const totalAmount = await Item.find({ _id: { $in: itemIds } })
      .then(items => items.reduce((sum, item) => sum + item.price, 0));

    const newTransaction = new Transaction({
      user: req.user.id,
      vendor: req.body.vendorId,  // Assumed vendorId is provided
      items: itemIds,
      totalAmount,
      paymentMethod,
      status: 'Pending'
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// View order status
exports.viewOrderStatus = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  const { transactionId } = req.body;
  try {
    const transaction = await Transaction.findByIdAndUpdate(transactionId, { status: 'Cancelled' }, { new: true });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};
