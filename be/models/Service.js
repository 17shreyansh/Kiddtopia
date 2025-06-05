// models/Service.js
const mongoose = require('mongoose');

// Schema for individual service images
const serviceImageSchema = new mongoose.Schema({
  src: { type: String, required: true }, // This will store the Cloudinary URL
  cloudinaryPublicId: { type: String, required: false }, // Store Cloudinary public ID for deletion
  alt: { type: String, default: '' }, // Optional: Add alt text for accessibility
});

// Schema for individual services
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: serviceImageSchema, // Each service now has an image OBJECT
});

// Main schema for the Services Page
const ServicesPageSchema = new mongoose.Schema({
  heading: { type: String, default: 'Our Services' }, // Default heading
  services: [serviceSchema], // Array of service objects
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', ServicesPageSchema);