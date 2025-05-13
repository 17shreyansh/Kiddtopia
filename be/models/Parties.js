const mongoose = require('mongoose');

const PartySectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  paragraphs: [{ type: String }],
  images: [{
    src: String,
    alt: String
  }],
  reverse: Boolean
});

const PartiesSchema = new mongoose.Schema({
  header: {
    mainTitle: String
  },
  sections: [PartySectionSchema]
});

const Parties = mongoose.model('Parties', PartiesSchema);
