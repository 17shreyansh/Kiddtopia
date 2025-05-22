const express = require('express');
const router = express.Router();
const PartyBooking = require('../models/PartyBooking');

// Create new booking
router.post('/', async (req, res) => {
  try {
    const { fullName, mobile, booking } = req.body;

    if (!fullName || !mobile || !booking) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const newBooking = new PartyBooking({
      fullName,
      mobile,
      booking
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: savedBooking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { booking: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const bookings = await PartyBooking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await PartyBooking.countDocuments(query);
    
    res.json({
      success: true,
      data: bookings,
      pagination: {
        current: parseInt(page),
        pageSize: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await PartyBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    const { fullName, mobile, booking, status, notes } = req.body;
    
    const updatedBooking = await PartyBooking.findByIdAndUpdate(
      req.params.id,
      { fullName, mobile, booking, status, notes },
      { new: true, runValidators: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking'
    });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const deletedBooking = await PartyBooking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting booking'
    });
  }
});

module.exports = router;