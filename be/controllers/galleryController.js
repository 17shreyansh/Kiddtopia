// controllers/galleryController.js
const Gallery = require('../models/galleryModel'); // Assuming your Mongoose model
const cloudinary = require('cloudinary').v2; // Cloudinary SDK

// Configure Cloudinary
// IMPORTANT: Replace with your actual Cloudinary credentials.
// It's highly recommended to use environment variables for these.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

// Get all gallery items
const getGalleryItems = async (req, res) => {
  try {
    // Fetch all gallery items, sorted by their order
    const galleryItems = await Gallery.find({}).sort({ order: 1 });
    res.json(galleryItems);
  } catch (error) {
    // Handle server errors
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Failed to retrieve gallery items.', error: error.message });
  }
};

// Get a specific gallery item
const getGalleryItem = async (req, res) => {
  try {
    // Find a single gallery item by its itemId
    const galleryItem = await Gallery.findOne({ itemId: req.params.itemId });

    // If no item is found, return 404
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json(galleryItem);
  } catch (error) {
    // Handle server errors
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Failed to retrieve gallery item.', error: error.message });
  }
};

// Update gallery item (replace image with Cloudinary upload)
const updateGalleryItem = async (req, res) => {
  try {
    const { itemId, title } = req.body; // Extract itemId and title from request body

    // Find the existing gallery item by itemId
    const galleryItem = await Gallery.findOne({ itemId });

    // If the gallery item doesn't exist, return 404
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const updateData = { title }; // Prepare data to update

    // If a new image file was uploaded
    if (req.file) {
      let uploadedImage;
      try {
        // Upload the new image buffer to Cloudinary
        // `req.file.buffer` is available when using `multer.memoryStorage()`
        uploadedImage = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          {
            folder: 'gallery_uploads', // Specify a folder in Cloudinary
            // You can add more options here, like `use_filename: true` etc.
          }
        );
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', cloudinaryError);
        return res.status(500).json({ message: 'Failed to upload new image to Cloudinary.', error: cloudinaryError.message });
      }

      // If there was an old image associated with a public ID, destroy it from Cloudinary
      if (galleryItem.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(galleryItem.imagePublicId);
          console.log(`Old image ${galleryItem.imagePublicId} deleted from Cloudinary.`);
        } catch (destroyError) {
          console.warn(`Could not delete old image ${galleryItem.imagePublicId} from Cloudinary:`, destroyError.message);
          // Log a warning but don't stop the process, as the new image was uploaded successfully.
        }
      }

      // Update the image URL and public ID in the database
      updateData.image = uploadedImage.secure_url;
      updateData.imagePublicId = uploadedImage.public_id;
    }

    // Update the gallery item in the database
    const updatedItem = await Gallery.findOneAndUpdate(
      { itemId },
      updateData,
      { new: true } // Return the updated document
    );

    res.json(updatedItem); // Send the updated item back
  } catch (error) {
    // Handle general server errors
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Failed to update gallery item.', error: error.message });
  }
};

// Initialize gallery with default items (if empty)
const initializeGallery = async (req, res) => {
  try {
    const count = await Gallery.countDocuments(); // Check if any documents exist

    // Only initialize if the gallery is empty
    if (count === 0) {
      const defaultItems = [];

      // Create 12 default gallery items with placeholder Cloudinary-like URLs
      // In a real application, you would upload these default images to Cloudinary
      // beforehand and use their actual secure_urls and public_ids here.
      for (let i = 1; i <= 12; i++) {
        defaultItems.push({
          itemId: `item${i}`,
          title: `Gallery Image ${i}`,
          // Using placehold.co for demonstration. Replace with actual Cloudinary URLs if available.
          image: `https://placehold.co/600x400/C0C0C0/000000?text=Default+Image+${i}`,
          // No publicId for placeholders, as they are not on Cloudinary
          imagePublicId: null, // Set to null or a placeholder if using external images
          order: i
        });
      }

      await Gallery.insertMany(defaultItems); // Insert all default items
      res.status(201).json({ message: 'Gallery initialized with default items' });
    } else {
      res.json({ message: 'Gallery already initialized' }); // Gallery is not empty
    }
  } catch (error) {
    // Handle server errors
    console.error('Error initializing gallery:', error);
    res.status(500).json({ message: 'Failed to initialize gallery.', error: error.message });
  }
};

module.exports = {
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  initializeGallery
};
