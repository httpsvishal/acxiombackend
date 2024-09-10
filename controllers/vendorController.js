const Item = require('../models/ItemModel');
const Transaction = require('../models/TransactionModel');

// Add a new Item
exports.addItem = async (req, res) => {
  const { name, description, price, status } = req.body;
  try {
    const newItem = new Item({ name, description, price, status, vendor: req.user.id });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
};

// Update Item (status, name, price, etc.)
exports.updateItem = async (req, res) => {
  const { itemId, data } = req.body;
  try {
    const updatedItem = await Item.findByIdAndUpdate(itemId, data, { new: true });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Delete an Item
exports.deleteItem = async (req, res) => {
  const { itemId } = req.body;
  try {
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
};

// Manage Transactions
exports.viewTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ vendor: req.user.id });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
};
