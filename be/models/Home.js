const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: Object,
    required: true,
  }
});

module.exports = mongoose.model('Home', homeSchema);
