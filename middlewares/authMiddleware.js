const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Verify User (role: User)
exports.verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id, role: 'User' });

    if (!user) {
      return res.status(401).json({ error: 'Not authorized as User' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token or not authorized as User' });
  }
};

// Verify Vendor (role: Vendor)
exports.verifyVendor = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await User.findOne({ _id: decoded.id, role: 'Vendor' });

    if (!vendor) {
      return res.status(401).json({ error: 'Not authorized as Vendor' });
    }

    req.user = vendor;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token or not authorized as Vendor' });
  }
};

// Verify Admin (role: Admin)
exports.verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findOne({ _id: decoded.id, role: 'Admin' });
    if (!admin) throw new Error();
    req.user = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Not authorized as Admin' });
  }
};
