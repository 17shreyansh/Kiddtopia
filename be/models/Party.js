const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  mainHeading: {
    type: String,
    required: true,
  },
  sections: [
    {
      title: {
        type: String,
        required: true,
      },
      paragraphs: {
        type: [String],
        required: true,
      },
      images: {
        type: [String],
        default: Array(5).fill('/Uploads/parties/placeholder.jpg'),
      },
      reverse: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model('Party', partySchema);