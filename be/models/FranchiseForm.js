const mongoose = require('mongoose');

// Define the schema for franchise form submissions
const franchiseFormSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the model
const FranchiseForm = mongoose.model('FranchiseForm', franchiseFormSchema);

module.exports = FranchiseForm;