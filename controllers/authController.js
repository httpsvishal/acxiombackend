const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel'); // Ensure User model is imported
const logger = require('../logger'); // Import the logger

// User signup (common for all roles: Admin, Vendor, User)
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      logger.warn(`Signup attempt with existing email: ${email}`);
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    if (!password) {
      logger.error('Password is undefined');
      return res.status(400).json({ error: 'Password is required' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    logger.info(`User signed up: ${user.email}`);
    res.status(201).json({ token, user });
  } catch (error) {
    logger.error(`Error during signup: ${error.message}`);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login attempt with non-existing email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, user });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).json({ error: 'Server error during login' });
  }
};