const express = require('express');
const router = express.Router();
const MembershipPlan = require('../models/MembershipPlan');

// Get all membership plans
router.get('/', async (req, res) => {
  try {
    const plans = await MembershipPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new plan
router.post('/', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description || price == null) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newPlan = new MembershipPlan({ title, description, price });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a plan
router.put('/:id', async (req, res) => {
  try {
    const { title, description, price } = req.body;
    if (!title || !description || price == null) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const updatedPlan = await MembershipPlan.findByIdAndUpdate(
      req.params.id,
      { title, description, price },
      { new: true }
    );
    if (!updatedPlan) return res.status(404).json({ error: 'Plan not found' });
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a plan
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ error: 'Plan not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
