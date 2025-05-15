// models/galleryModel.js
const mongoose = require('mongoose');

const gallerySchema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;