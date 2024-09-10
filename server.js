const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const userRoutes = require('./routes/userRoutes');
const logger = require('./logger'); // Import the logger
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
      logger.info('MongoDB connected successfully');
      console.log('MongoDB connected successfully');
    })
    .catch((error) => {
      logger.error(`MongoDB connection error: ${error}`);
      console.log(`MongoDB connection error: ${error}`);
    });

const PORT = process.env.PORT || 1400;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Vendor routes
app.use('/api/vendor', vendorRoutes);

// User routes
app.use('/api/user', userRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);