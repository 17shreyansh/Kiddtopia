const express = require('express');
const router = express.Router();
const AboutUs = require('../models/AboutUs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/about';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `about-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only! Only JPEG, JPG, PNG, or WebP files are allowed.'));
    }
  },
});

// Get about us data
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

// Update heading and mainTitle
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
            src: '/default-about-image.jpg',
            alt: 'Kiddtopia play area',
          })),
        },
        secondSection: {
          heading: secondHeading || '',
          paragraphs: [],
          images: Array(4).fill().map(() => ({
            src: '/default-about-image.jpg',
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

// Update paragraphs
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

// Upload image
router.post('/image/:section/:index', auth, upload.single('image'), async (req, res) => {
  try {
    const { section, index } = req.params;
    const idx = parseInt(index, 10);

    if (!['firstSection', 'secondSection'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    if (isNaN(idx) || idx < 0 || idx >= 4) {
      return res.status(400).json({ message: 'Invalid image index (must be 0-3)' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/about/${req.file.filename}`;

    let aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
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
      if (section === 'firstSection') {
        aboutUs.firstSection.images[idx] = {
          src: imageUrl,
          alt: req.body.alt || 'Kiddtopia play area',
        };
      } else {
        aboutUs.secondSection.images[idx] = {
          src: imageUrl,
          alt: req.body.alt || 'Kiddtopia activities',
        };
      }
    } else {
      // Ensure the images array has exactly 4 elements
      if (!aboutUs[section].images || aboutUs[section].images.length < 4) {
        aboutUs[section].images = Array(4).fill().map(() => ({
          src: '/default-about-image.jpg',
          alt: section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities',
        }));
      }

      // Update the image at the specified index
      aboutUs[section].images[idx] = {
        src: imageUrl,
        alt: req.body.alt || (section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities'),
      };
    }

    aboutUs.lastUpdated = Date.now();
    await aboutUs.save();

    res.json({ success: true, imageUrl, aboutUs });
  } catch (err) {
    console.error(err);
    if (err.message === 'Images only! Only JPEG, JPG, PNG, or WebP files are allowed.') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete image
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

    // Reset the image at the specified index to default
    aboutUs[section].images[idx] = {
      src: '/default-about-image.jpg',
      alt: section === 'firstSection' ? 'Kiddtopia play area' : 'Kiddtopia activities',
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