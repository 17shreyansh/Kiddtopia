// routes/partyPageRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2; // Make sure to import cloudinary
const Party = require('../models/Party');
const auth = require('../middleware/authMiddleware');


const router = express.Router();

// Configure multer for temporary file storage before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempUploadDir = 'temp-uploads'; // This should be the same as in your server.js
    if (!fs.existsSync(tempUploadDir)) {
      fs.mkdirSync(tempUploadDir, { recursive: true });
    }
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper function to upload an image to Cloudinary
const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "kiddtopia_parties", // A dedicated folder for party images on Cloudinary
      unique_filename: true,
      overwrite: false,
    });
    fs.unlinkSync(filePath); // Delete the temporary file after successful upload
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Ensure temp file is deleted even on error
    }
    throw new Error('Image upload to Cloudinary failed.');
  }
};

// GET - Fetch all parties data
router.get('/', async (req, res) => {
  try {
    let partyData = await Party.findOne();

    if (!partyData) {
      const defaultSections = [
        {
          title: 'Where Every Birthday Adventure Begins!',
          paragraphs: [
            "Celebrate your child's special day at Kiddtopia, where fun meets adventure! Our vibrant indoor play center offers a perfect blend of entertainment for all ages. With thrilling soft play areas, exciting VR games, and a variety of arcade games, Kiddtopia promises an unforgettable birthday experience for your little one and their friends. Our party packages include themed decorations, dedicated party hosts, and customized multi-cuisine menus to delight both kids and adults. Whether it's racing in the Go-Karts, bouncing around the play zones, or diving into immersive VR worlds, Kiddtopia is the ultimate birthday destination that guarantees fun-filled memories.",
          ],
          images: Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/placeholder_party_1.jpg'), // <<-- UPDATE THIS
          reverse: false,
        },
        {
          title: 'Host the Ultimate Kitty Party at Kiddtopia!',
          paragraphs: [
            'Looking for a unique, fun-filled venue to host your next Kitty Party? Kiddtopia offers the perfect mix of entertainment, food, and relaxation for an unforgettable experience. Whether it’s a casual gathering with friends or a themed event, our vibrant and lively atmosphere makes every Kitty Party one to remember.',
          ],
          images: Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/placeholder_party_2.jpg'), // <<-- UPDATE THIS
          reverse: true,
        },
        {
          title: 'Host Memorable Corporate Events at Kiddtopia',
          paragraphs: [
            'Looking for a fun and dynamic venue to host your next corporate event? Kiddtopia is the perfect spot to combine business with entertainment, offering a refreshing break from the usual boardroom setting. Whether it’s team-building activities, company celebrations, or client appreciation events, our venue provides a unique environment that fosters creativity, collaboration, and fun.',
          ],
          images: Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/placeholder_party_3.jpg'), // <<-- UPDATE THIS
          reverse: false,
        },
        {
          title: 'Dive into Fun with a Kiddtopia Pool Party!',
          paragraphs: [
            'Make a splash at Kiddtopia’s Poolside with an exciting and refreshing Pool Party experience! Whether you’re celebrating a birthday, hosting a summer get-together, or just looking for a reason to have fun with friends, our poolside parties offer the perfect combination of sun, fun, and relaxation.',
          ],
          images: Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/placeholder_party_4.jpg'), // <<-- UPDATE THIS
          reverse: true,
        },
        {
          title: 'Host an Enchanting Lawn Party at Kiddtopia!',
          paragraphs: [
            'Bring your celebration outdoors and enjoy the beauty of nature with a delightful Lawn Party at Kiddtopia! Our expansive and lush lawn area is the perfect setting for any occasion, offering a blend of fun, relaxation, and the beauty of the great outdoors.',
          ],
          images: Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/placeholder_party_5.jpg'), // <<-- UPDATE THIS
          reverse: false,
        },
      ];

      partyData = new Party({
        mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
        sections: defaultSections,
      });
      await partyData.save(); // Save the default data if it doesn't exist
    } else {
      // Clean up invalid images or set to a Cloudinary placeholder
      partyData.sections = partyData.sections.map((section) => ({
        ...section,
        images: Array.isArray(section.images)
          ? section.images.map((img) =>
              typeof img === 'string' && img.startsWith('http') // Check if it's a valid URL (assuming Cloudinary URLs start with http)
                ? img
                : 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg' // <<-- UPDATE THIS
            )
          : Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg'), // <<-- UPDATE THIS
      }));
      await partyData.save();
    }

    res.status(200).json(partyData);
  } catch (error) {
    console.error('Error fetching party data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT - Update main heading
router.put('/heading', auth, async (req, res) => {
  try {
    const { mainHeading } = req.body;

    if (!mainHeading || typeof mainHeading !== 'string') {
      return res.status(400).json({ message: 'Valid main heading is required' });
    }

    let partyData = await Party.findOne();

    if (!partyData) {
      partyData = new Party({ mainHeading, sections: [] });
    } else {
      partyData.mainHeading = mainHeading;
      // Clean up invalid images or set to a Cloudinary placeholder
      partyData.sections = partyData.sections.map((section) => ({
        ...section,
        images: Array.isArray(section.images)
          ? section.images.map((img) =>
              typeof img === 'string' && img.startsWith('http')
                ? img
                : 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg' // <<-- UPDATE THIS
            )
          : Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg'), // <<-- UPDATE THIS
      }));
    }

    await partyData.save();
    res.status(200).json(partyData);
  } catch (error) {
    console.error('Error updating main heading:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST - Add a new section
router.post('/section', auth, async (req, res) => {
  try {
    const { title, paragraphs, images, reverse } = req.body;

    if (!title || !Array.isArray(paragraphs)) {
      return res.status(400).json({ message: 'Title and paragraphs array are required' });
    }

    const newSection = {
      title,
      paragraphs,
      images: Array.isArray(images)
        ? images.map((img) => (typeof img === 'string' && img.startsWith('http') ? img : 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg')) // <<-- UPDATE THIS
        : Array(5).fill('https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg'), // <<-- UPDATE THIS
      reverse: reverse !== undefined ? reverse : false,
    };

    let partyData = await Party.findOne();

    if (!partyData) {
      partyData = new Party({
        mainHeading: 'Celebrate Every Special Moment at Kiddtopia',
        sections: [newSection],
      });
    } else {
      partyData.sections.push(newSection);
    }

    await partyData.save();
    res.status(201).json(partyData);
  } catch (error) {
    console.error('Error adding section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT - Update a specific section
router.put('/section/:index', auth, async (req, res) => {
  try {
    const { index } = req.params;
    const { title, paragraphs, images, reverse } = req.body;

    const sectionIndex = parseInt(index);
    if (isNaN(sectionIndex)) {
      return res.status(400).json({ message: 'Invalid section index' });
    }

    const partyData = await Party.findOne();
    if (!partyData) {
      return res.status(404).json({ message: 'Party data not found' });
    }

    if (sectionIndex < 0 || sectionIndex >= partyData.sections.length) {
      return res.status(400).json({ message: 'Section index out of bounds' });
    }

    partyData.sections[sectionIndex] = {
      title: title || partyData.sections[sectionIndex].title,
      paragraphs: paragraphs || partyData.sections[sectionIndex].paragraphs,
      images: Array.isArray(images)
        ? images.map((img) => (typeof img === 'string' && img.startsWith('http') ? img : 'https://res.cloudinary.com/<YOUR_CLOUD_NAME>/image/upload/v1700000000/kiddtopia_placeholders/default_placeholder.jpg')) // <<-- UPDATE THIS
        : partyData.sections[sectionIndex].images,
      reverse: reverse !== undefined ? reverse : partyData.sections[sectionIndex].reverse,
    };

    await partyData.save();
    res.status(200).json(partyData);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE - Remove a section
router.delete('/section/:index', auth, async (req, res) => {
  try {
    const { index } = req.params;

    const sectionIndex = parseInt(index);
    if (isNaN(sectionIndex)) {
      return res.status(400).json({ message: 'Invalid section index' });
    }

    const partyData = await Party.findOne();
    if (!partyData) {
      return res.status(404).json({ message: 'Party data not found' });
    }

    if (sectionIndex < 0 || sectionIndex >= partyData.sections.length) {
      return res.status(400).json({ message: 'Section index out of bounds' });
    }

    partyData.sections.splice(sectionIndex, 1);
    await partyData.save();
    res.status(200).json(partyData);
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST - Upload images to Cloudinary (specific to party page sections)
router.post('/upload', auth, upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const imagePaths = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file.path);
      imagePaths.push(url);
    }

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully to Cloudinary',
      imagePaths, // Returns an array of Cloudinary URLs
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;