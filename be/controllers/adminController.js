const bcrypt = require('bcryptjs');
require('dotenv').config(); // Ensure this is at the top
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

// Preload admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Register admin once (on server start or API call)
exports.registerAdminFromEnv = async (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ message: 'Admin email or password not set in .env' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const newAdmin = new Admin({ email: ADMIN_EMAIL, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created from .env successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during admin creation' });
  }
};

// Admin login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};