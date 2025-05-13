const express = require('express');
const homeController = require('../controllers/homeController');
const upload = require('../middleware/uploadMiddleware');
const protect = require('../middleware/authMiddleware'); // Make sure path is correct


const router = express.Router();

// Route to get section data
router.get('/:sectionName', homeController.getSection);

// Route to update section data
router.post('/:sectionName', protect , upload.single('image'), homeController.updateSection);

// Route to delete an image from a section
router.delete('/:sectionName/images/:imageName', protect , homeController.deleteImage);

module.exports = router;