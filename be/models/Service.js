const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: false }, // make optional for editing
});

const ServicesPageSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  services: [ServiceSchema],
});

module.exports = mongoose.model('ServicesPage', ServicesPageSchema);
