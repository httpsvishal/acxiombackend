const logger = require('../logger'); // Import the logger
const User = require('../models/UserModel'); // Import the User model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for JWT token generation

// User signup (common for all roles: Admin, Vendor, User)
exports.signup = async (req, res) => {
  const { name, email, password, role, category } = req.body;
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
    const userData = { name, email, password: hashedPassword, role };
    if (role === 'Admin') {
      if (!category) {
        logger.error('Category is required for admin users');
        return res.status(400).json({ error: 'Category is required for admin users' });
      }
      userData.category = category;
    }

    user = new User(userData);
    await user.save();

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    logger.error(`Signup error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
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