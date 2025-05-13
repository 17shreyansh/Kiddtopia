const express = require('express');
const router = express.Router();
const Party = require('../models/Parties'); // Assuming you have a Party model
const upload = require('../middleware/uploadMiddleware'); // Middleware for handling file uploads
const verifyToken = require('../middleware/authMiddleware'); // Middleware for authentication

// Get parties content
router.get('/', async (req, res) => {
  try {
    const parties = await Parties.findOne();
    if (!parties) {
      return res.status(404).json({ message: 'Parties data not found' });
    }
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/header', verifyToken, async (req, res) => {
  try {
    const { mainTitle } = req.body;
    let parties = await Parties.findOne();
    if (!parties) {
      parties = new Parties({ header: { mainTitle }, sections: [] });
    } else {
      parties.header.mainTitle = mainTitle;
    }
    await parties.save();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update header' });
  }
});

router.put('/section/:index', verifyToken, async (req, res) => {
  try {
    const { index } = req.params;
    const { title, paragraphs, reverse } = req.body;
    let parties = await Parties.findOne();
    if (!parties) {
      return res.status(404).json({ message: 'Parties data not found' });
    }
    parties.sections[index] = {
      ...parties.sections[index],
      title,
      paragraphs: paragraphs.filter(p => p.trim() !== ''),
      reverse
    };
    await parties.save();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update section' });
  }
});

router.post('/section/:index/image/:imageIndex', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { index, imageIndex } = req.params;
    let parties = await Parties.findOne();
    if (!parties) {
      return res.status(404).json({ message: 'Parties data not found' });
    }
    parties.sections[index].images[imageIndex] = {
      src: `/uploads/parties/${req.file.filename}`,
      alt: `Party image ${parseInt(imageIndex) + 1}`
    };
    await parties.save();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

router.delete('/section/:index/image/:imageIndex', verifyToken, async (req, res) => {
  try {
    const { index, imageIndex } = req.params;
    let parties = await Parties.findOne();
    if (!parties) {
      return res.status(404).json({ message: 'Parties data not found' });
    }
    parties.sections[index].images[imageIndex] = {
      src: '/default-party-image.jpg',
      alt: `Default party image ${parseInt(imageIndex) + 1}`
    };
    await parties.save();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

module.exports = router;

