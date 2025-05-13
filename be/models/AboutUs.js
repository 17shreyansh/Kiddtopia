// models/AboutUs.js
const mongoose = require('mongoose');

const AboutUsSchema = new mongoose.Schema({
  mainTitle: {
    type: String,
    required: true,
    default: 'Kiddtopia: A Premium Adventure for Kids'
  },
  firstSection: {
      heading: {
    type: String,
    default: 'ABOUT US'
  },
    paragraphs: [{ 
      type: String,
      required: true
    }],
    images: [{
      
      src: { 
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: 'Kiddtopia play area'
      }
    }]
  },
  secondSection: {
      heading: {
    type: String,
  },
    paragraphs: [{ 
      type: String,
      required: true
    }],
    images: [{
      src: { 
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: 'Kiddtopia activities'
      }
    }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AboutUs', AboutUsSchema);