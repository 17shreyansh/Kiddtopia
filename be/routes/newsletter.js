// routes/newsletter.js
const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const authMiddleware = require('../middleware/authMiddleware'); // Your existing auth middleware
const rateLimit = require('express-rate-limit');

// Rate limiting for subscription endpoint
const subscribeLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many subscription attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for admin login
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
router.post('/subscribe', subscribeLimit, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if email already exists
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate if previously unsubscribed
        await existingSubscriber.resubscribe();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.'
        });
      }
    }

    // Create new subscriber
    const newSubscriber = new Newsletter({
      email: email.toLowerCase(),
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer')
      }
    });

    await newSubscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    if (!subscriber.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Email is already unsubscribed'
      });
    }

    await subscriber.unsubscribe();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Admin login
// @route   POST /api/newsletter/login
// @access  Public
router.post('/login', loginLimit, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Replace these with your actual admin credentials
    // In production, these should be environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token (assuming you have JWT setup)
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { role: 'admin', username: username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// @desc    Get all subscribers (Admin only)
// @route   GET /api/newsletter/subscribers
// @access  Private/Admin
router.get('/subscribers', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status; // 'active', 'inactive', or undefined for all

    // Build query based on status filter
    let query = {};
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Get subscribers with pagination
    const subscribers = await Newsletter.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Newsletter.countDocuments(query);
    const activeCount = await Newsletter.countDocuments({ isActive: true });
    const inactiveCount = await Newsletter.countDocuments({ isActive: false });

    res.status(200).json({
      success: true,
      data: subscribers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      },
      stats: {
        total: totalCount,
        active: activeCount,
        inactive: inactiveCount
      }
    });

  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Could not fetch subscribers.'
    });
  }
});

// @desc    Get newsletter statistics (Admin only)
// @route   GET /api/newsletter/stats
// @access  Private/Admin
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();
    const activeSubscribers = await Newsletter.countDocuments({ isActive: true });
    const inactiveSubscribers = await Newsletter.countDocuments({ isActive: false });

    // Get subscribers from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSubscribers = await Newsletter.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get subscribers from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklySubscribers = await Newsletter.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalSubscribers,
        active: activeSubscribers,
        inactive: inactiveSubscribers,
        last30Days: recentSubscribers,
        last7Days: weeklySubscribers,
        conversionRate: totalSubscribers > 0 ? ((activeSubscribers / totalSubscribers) * 100).toFixed(2) : 0
      }
    });

  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Could not fetch statistics.'
    });
  }
});

// @desc    Delete subscriber (Admin only)
// @route   DELETE /api/newsletter/subscribers/:id
// @access  Private/Admin
router.delete('/subscribers/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Newsletter.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    await Newsletter.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Could not delete subscriber.'
    });
  }
});

// @desc    Update subscriber status (Admin only)
// @route   PATCH /api/newsletter/subscribers/:id
// @access  Private/Admin
router.patch('/subscribers/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const subscriber = await Newsletter.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    if (isActive !== undefined) {
      if (isActive && !subscriber.isActive) {
        await subscriber.resubscribe();
      } else if (!isActive && subscriber.isActive) {
        await subscriber.unsubscribe();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber updated successfully',
      data: subscriber
    });

  } catch (error) {
    console.error('Update subscriber error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Could not update subscriber.'
    });
  }
});

module.exports = router;