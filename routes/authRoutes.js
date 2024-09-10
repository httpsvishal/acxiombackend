const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");

// Signup route (for all roles: User, Vendor, Admin)
router.post('/signup', authController.signup);

// Login route (for all roles)
router.post('/login', authController.login);

module.exports = router;
