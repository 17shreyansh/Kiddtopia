const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware'); // Make sure path is correct

// Admin login route
router.post('/login', adminController.login);

// Register admin from .env (run once manually)
router.get('/init-admin', adminController.registerAdminFromEnv);

// ✅ Protected route to verify token
router.get('/', protect, (req, res) => {
  res.json({ message: 'Token is valid', adminId: req.admin });
});

module.exports = router;
