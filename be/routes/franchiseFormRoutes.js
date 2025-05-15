const express = require('express');
const router = express.Router();
const FranchiseForm = require('../models/FranchiseForm');

/**
 * @route   GET /api/franchiseforms
 * @desc    Get all franchise form submissions
 * @access  Private (admin only)
 */
router.get('/franchiseforms', async (req, res) => {
  try {
    const franchiseForms = await FranchiseForm.find().sort({ createdAt: -1 });
    res.json(franchiseForms);
  } catch (err) {
    console.error('Error fetching franchise forms:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/franchiseforms/:id
 * @desc    Get franchise form by ID
 * @access  Private (admin only)
 */
router.get('/franchiseforms/:id', async (req, res) => {
  try {
    const franchiseForm = await FranchiseForm.findById(req.params.id);
    
    if (!franchiseForm) {
      return res.status(404).json({ error: 'Franchise form not found' });
    }
    
    res.json(franchiseForm);
  } catch (err) {
    console.error('Error fetching franchise form:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Franchise form not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   POST /api/franchiseforms
 * @desc    Create a new franchise form submission
 * @access  Public
 */
router.post('/franchiseforms', async (req, res) => {
  try {
    const { fullName, mobile, email, city, message } = req.body;
    
    // Validation
    if (!fullName || !mobile || !email || !city) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    
    // Create new franchise form submission
    const newFranchiseForm = new FranchiseForm({
      fullName,
      mobile,
      email,
      city,
      message: message || '' // Handle empty message
    });
    
    const franchiseForm = await newFranchiseForm.save();
    res.status(201).json(franchiseForm);
  } catch (err) {
    console.error('Error creating franchise form:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   DELETE /api/franchiseforms/:id
 * @desc    Delete a franchise form submission
 * @access  Private (admin only)
 */
router.delete('/franchiseforms/:id', async (req, res) => {
  try {
    const franchiseForm = await FranchiseForm.findById(req.params.id);
    
    if (!franchiseForm) {
      return res.status(404).json({ error: 'Franchise form not found' });
    }
    
    await franchiseForm.deleteOne();
    res.json({ message: 'Franchise form removed successfully' });
  } catch (err) {
    console.error('Error deleting franchise form:', err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Franchise form not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;