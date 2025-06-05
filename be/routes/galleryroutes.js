// routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Multer for handling file uploads

const {
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  initializeGallery
} = require('../controllers/galleryController');
const auth = require('../middleware/authMiddleware'); // Assuming your authentication middleware

// Set up Multer for file uploads.
// Using memoryStorage() to get the file as a buffer,
// which is then sent directly to Cloudinary without saving to disk.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes for gallery operations

// GET all gallery items
router.get('/', getGalleryItems);

// GET a specific gallery item by itemId
router.get('/:itemId', getGalleryItem);

// PUT (update) a gallery item.
// This route requires authentication and handles image uploads via Multer,
// which then passes the file buffer to the controller for Cloudinary upload.
router.put('/:itemId', auth, upload.single('image'), updateGalleryItem);

// POST to initialize the gallery with default items.
// This route also requires authentication.
router.post('/initialize', auth, initializeGallery);

module.exports = router;
