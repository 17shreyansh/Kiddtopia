const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authMiddleware');

// @route   POST api/contacts
// @desc    Create a new contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { fullName, mobile, email, message } = req.body;
    
    const newContact = new Contact({
      fullName,
      mobile,
      email,
      message
    });

    const contact = await newContact.save();
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET api/contacts
// @desc    Get all contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET api/contacts/:id
// @desc    Get contact by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT api/contacts/:id
// @desc    Update contact status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   DELETE api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
