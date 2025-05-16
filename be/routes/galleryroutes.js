const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  initializeGallery
} = require('../controllers/galleryController');
const auth = require('../middleware/authMiddleware');


// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `gallery-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Routes
router.get('/', getGalleryItems);
router.get('/:itemId', getGalleryItem);
router.put('/:itemId',auth, upload.single('image'), updateGalleryItem);
router.post('/initialize',auth, initializeGallery);

module.exports = router;
