// controllers/galleryController.js
const Gallery = require('../models/galleryModel');
const fs = require('fs');
const path = require('path');

// Get all gallery items
const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find({}).sort({ order: 1 });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific gallery item
const getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findOne({ itemId: req.params.itemId });
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update gallery item (replace image)
const updateGalleryItem = async (req, res) => {
  try {
    const { itemId, title } = req.body;
    
    // Find the existing gallery item
    const galleryItem = await Gallery.findOne({ itemId });
    
    if (!galleryItem) {
      // If the file was uploaded, remove it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    // Update the item
    const updateData = { title };
    
    // If a new image was uploaded
    if (req.file) {
      // Get the old image path
      const oldImagePath = path.join(__dirname, '..', galleryItem.image);
      
      // Delete the old image if it exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      
      // Update with new image path
      updateData.image = `/uploads/gallery/${req.file.filename}`;
    }
    
    // Update the gallery item
    const updatedItem = await Gallery.findOneAndUpdate(
      { itemId },
      updateData,
      { new: true }
    );
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize gallery with default items (if empty)
const initializeGallery = async (req, res) => {
  try {
    const count = await Gallery.countDocuments();
    
    // Only initialize if gallery is empty
    if (count === 0) {
      const defaultItems = [];
      
      // Create 12 default gallery items
      for (let i = 1; i <= 12; i++) {
        defaultItems.push({
          itemId: `item${i}`,
          title: `Gallery Image ${i}`,
          image: `/uploads/gallery/default${i}.jpg`, // Default image path
          order: i
        });
      }
      
      await Gallery.insertMany(defaultItems);
      res.status(201).json({ message: 'Gallery initialized with default items' });
    } else {
      res.json({ message: 'Gallery already initialized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  initializeGallery
};