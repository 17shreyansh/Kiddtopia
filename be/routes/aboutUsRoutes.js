const express = require('express');
const router = express.Router();
const AboutUs = require('../models/AboutUs'); // Ensure your AboutUs model is correctly imported
const auth = require('../middleware/authMiddleware');
// --- Import Cloudinary for the DELETE route if you plan to delete from Cloudinary ---
const cloudinary = require('cloudinary').v2; // Make sure Cloudinary is configured in server.js
// You might need to add `require('dotenv').config();` here too if your Cloudinary config isn't
// globally available via server.js or if you want to use it for deletion directly in this file.
// However, if cloudinary.config is already done in server.js, it might be accessible.
// For safety, you can add:
// require('dotenv').config();


// --- REMOVE MULTER CONFIGURATION FROM HERE ---
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const storage = multer.diskStorage({ ... });
// const upload = multer({ ... });
// --- END REMOVAL ---

// --- IMPORTANT: Your AboutUs model should now have fields for Cloudinary URLs ---
// Example (refer to previous guidance on updating models):
// const AboutUs = mongoose.model('AboutUs', new mongoose.Schema({
//   imageUrl: String,
//   cloudinaryPublicId: String,
//   // ... other fields
// }));

// @route   POST /api/about
// @desc    Create/Update About Us content with image
// @access  Private (auth middleware should be used)
// IMPORTANT: This route now expects the Cloudinary URL and publicId directly in the request body,
// NOT a file upload. The file upload happens via the central /uploads route first.
router.post('/', auth, async (req, res) => {
  // Destructure the Cloudinary URL and publicId from the request body,
  // along with any other form data.
  const { title, content, imageUrl, cloudinaryPublicId } = req.body;

  try {
    // Find an existing About Us document or create a new one
    // Assuming you usually have only one About Us page
    let aboutUs = await AboutUs.findOne();

    if (aboutUs) {
      // Update existing content
      aboutUs.title = title || aboutUs.title;
      aboutUs.content = content || aboutUs.content;
      aboutUs.imageUrl = imageUrl || aboutUs.imageUrl; // Update with new Cloudinary URL
      aboutUs.cloudinaryPublicId = cloudinaryPublicId || aboutUs.cloudinaryPublicId; // Update publicId
    } else {
      // Create new content
      aboutUs = new AboutUs({
        title,
        content,
        imageUrl,
        cloudinaryPublicId,
      });
    }

    await aboutUs.save();
    res.status(200).json(aboutUs);
  } catch (error) {
    console.error('Error saving About Us content:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/about
// @desc    Get About Us content
// @access  Public
router.get('/', async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json({ message: 'No About Us data found' });
    }
    res.json(aboutUs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/about/header
// @desc    Update heading and mainTitle
// @access  Private (auth middleware should be used)
router.put('/header', auth, async (req, res) => {
  try {
    const { firstHeading, secondHeading, mainTitle } = req.body;

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = new AboutUs({
        mainTitle: mainTitle || 'Kiddtopia: A Premium Adventure for Kids',
        firstSection: {
          heading: firstHeading || 'ABOUT US',
          paragraphs: [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg', // These should be updated by migration script later
            alt: 'Kiddtopia play area',
          })),
        },
        secondSection: {
          heading: secondHeading || '',
          paragraphs: [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg', // These should be updated by migration script later
            alt: 'Kiddtopia activities',
          })),
        },
      });
    } else {
      if (firstHeading !== undefined) aboutUs.firstSection.heading = firstHeading;
      if (secondHeading !== undefined) aboutUs.secondSection.heading = secondHeading;
      if (mainTitle) aboutUs.mainTitle = mainTitle;
    }

    aboutUs.lastUpdated = Date.now();
    await aboutUs.save();

    res.json(aboutUs);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/about/paragraphs/:section
// @desc    Update paragraphs for a section
// @access  Private (auth middleware should be used)
router.put('/paragraphs/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    let { paragraphs } = req.body;

    if (!['firstSection', 'secondSection'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }

    // Ensure paragraphs is an array of non-empty strings
    paragraphs = Array.isArray(paragraphs) ? paragraphs.filter(p => p.trim() !== '') : [];

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      aboutUs = new AboutUs({
        mainTitle: 'Kiddtopia: A Premium Adventure for Kids',
        firstSection: {
          heading: 'ABOUT US',
          paragraphs: section === 'firstSection' ? paragraphs : [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg',
            alt: 'Kiddtopia play area',
          })),
        },
        secondSection: {
          heading: '',
          paragraphs: section === 'secondSection' ? paragraphs : [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg',
            alt: 'Kiddtopia activities',
          })),
        },
      });
    } else {
      aboutUs[section].paragraphs = paragraphs;
    }

    aboutUs.lastUpdated = Date.now();

    try {
      await aboutUs.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'At least one paragraph is required' });
      }
      throw err;
    }

    res.json(aboutUs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/about/image/:section/:index
// @desc    Upload image to a specific section and index
// @access  Private (auth middleware should be used)
// IMPORTANT: This route now expects the Cloudinary URL and publicId directly in the request body,
// NOT a file upload via Multer. The file upload happens via the central /uploads route first.
router.post('/image/:section/:index', auth, async (req, res) => {
  try {
    const { section, index } = req.params;
    const idx = parseInt(index, 10);
    // Expect imageUrl and cloudinaryPublicId from the request body
    const { imageUrl, cloudinaryPublicId, alt } = req.body; // Line 194 in your error

    if (!['firstSection', 'secondSection'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    if (isNaN(idx) || idx < 0 || idx >= 4) {
      return res.status(400).json({ message: 'Invalid image index (must be 0-3)' });
    }
    // Check if Cloudinary URL is provided
    if (!imageUrl) {
      return res.status(400).json({ message: 'Cloudinary image URL is required.' });
    }
    // cloudinaryPublicId is highly recommended but not strictly required by this route if not used for deletion
    // if (!cloudinaryPublicId) {
    //   return res.status(400).json({ message: 'Cloudinary public ID is required.' });
    // }

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      // If no AboutUs document exists, create a new one with default values
      // and update the specific image
      aboutUs = new AboutUs({
        mainTitle: 'Kiddtopia: A Premium Adventure for Kids',
        firstSection: {
          heading: 'ABOUT US',
          paragraphs: [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg',
            alt: 'Kiddtopia play area',
          })),
        },
        secondSection: {
          heading: '',
          paragraphs: [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg',
            alt: 'Kiddtopia activities',
          })),
        },
      });
    }

    // Ensure the images array has exactly 4 elements
    if (!aboutUs[section].images || aboutUs[section].images.length < 4) {
      aboutUs[section].images = Array(4).fill().map(() => ({
        src: '/default-about-image.jpg',
        alt: section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities',
      }));
    }

    // Update the image at the specified index with Cloudinary data
    aboutUs[section].images[idx] = {
      src: imageUrl,
      alt: alt || (section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities'),
      cloudinaryPublicId: cloudinaryPublicId || undefined, // Store publicId if provided
    };

    aboutUs.lastUpdated = Date.now();
    await aboutUs.save();

    res.json({ success: true, imageUrl, aboutUs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/about/image/:section/:index
// @desc    Delete image from a specific section and index (and from Cloudinary if stored)
// @access  Private (auth middleware should be used)
router.delete('/image/:section/:index', auth, async (req, res) => {
  try {
    const { section, index } = req.params;
    const idx = parseInt(index, 10);

    if (!['firstSection', 'secondSection'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    if (isNaN(idx) || idx < 0 || idx >= 4) {
      return res.status(400).json({ message: 'Invalid image index (must be 0-3)' });
    }

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json({ message: 'No About Us data found' });
    }

    // Ensure the images array has exactly 4 elements
    if (!aboutUs[section].images || aboutUs[section].images.length < 4) {
      aboutUs[section].images = Array(4).fill().map(() => ({
        src: '/default-about-image.jpg',
        alt: section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities',
      }));
    }

    const imageToDelete = aboutUs[section].images[idx];

    // Optional: Delete image from Cloudinary if publicId is stored
    if (imageToDelete && imageToDelete.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(imageToDelete.cloudinaryPublicId);
        console.log(`Deleted image from Cloudinary: ${imageToDelete.cloudinaryPublicId}`);
      } catch (cloudinaryErr) {
        console.error(`Error deleting image from Cloudinary (${imageToDelete.cloudinaryPublicId}):`, cloudinaryErr.message);
        // Do not block deletion from MongoDB even if Cloudinary fails
      }
    }

    // Reset the image at the specified index to default placeholder
    aboutUs[section].images[idx] = {
      src: '/default-about-image.jpg',
      alt: section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities',
      cloudinaryPublicId: undefined, // Clear publicId
    };

    aboutUs.lastUpdated = Date.now();
    await aboutUs.save();

    res.json({ success: true, aboutUs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
