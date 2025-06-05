const express = require('express');
const router = express.Router();
const ServicesPage = require('../models/Service');
const auth = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;

// Removed: const multer = require('multer'); // No longer needed

// Helper function to get a default Cloudinary placeholder image object
const getDefaultServiceImage = () => ({
  // IMPORTANT: Replace with YOUR actual Cloudinary default image URL.
  // Make sure this image exists in your Cloudinary account.
  src: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1700000000/kiddtopia_placeholders/service_default.jpg`,
  alt: 'Default service image',
  cloudinaryPublicId: undefined, // Default placeholders don't have a public ID to delete
});

// @route   GET /api/services
// @desc    Get services page data
// @access  Public
router.get('/', async (req, res) => {
  try {
    let page = await ServicesPage.findOne();

    if (!page) {
      // Create a default entry if no page exists
      page = new ServicesPage({
        heading: 'Explore Our Exciting Services',
        services: [
          {
            title: 'Birthday Parties',
            description: 'Unforgettable birthday celebrations with games, fun, and food!',
            image: getDefaultServiceImage(),
          },
          {
            title: 'Kitty Parties',
            description: 'Host lively kitty parties with entertainment for all your friends.',
            image: getDefaultServiceImage(),
          },
          {
            title: 'Corporate Events',
            description: 'Unique and engaging venues for team-building and corporate gatherings.',
            image: getDefaultServiceImage(),
          },
          {
            title: 'School Excursions',
            description: 'Educational and fun outings for school groups.',
            image: getDefaultServiceImage(),
          },
        ],
      });
      await page.save(); // Save the newly created default page
    } else {
      // Ensure existing services/images match the new schema structure and provide defaults if missing
      page.services = page.services.map(service => {
        const image = service.image && typeof service.image.src === 'string' && service.image.src.startsWith('http')
          ? service.image // Keep existing valid image object
          : getDefaultServiceImage(); // Replace with default placeholder object

        return {
          title: service.title,
          description: service.description,
          image: image,
        };
      });
      await page.save(); // Save after ensuring data consistency
    }

    res.json(page);
  } catch (error) {
    console.error('Error fetching services page data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/services
// @desc    Update services page (heading and all services)
// @access  Private (auth middleware should be used)
router.put('/', auth, async (req, res) => { // Removed `upload.array('images')` - Multer is no longer used here
  const { heading, services } = req.body; // `express.json()` middleware parses this

  if (!Array.isArray(services)) {
    return res.status(400).json({ error: 'Services must be an array.' });
  }

  let page = await ServicesPage.findOne();
  if (!page) {
    page = new ServicesPage(); // Create new page if it doesn't exist
  }

  const oldImagePublicIds = new Set(
    page.services
      .map(s => s.image?.cloudinaryPublicId)
      .filter(id => id && id !== getDefaultServiceImage().cloudinaryPublicId)
  );

  const finalServicesData = [];
  const newImagePublicIds = new Set();
  const uploadPromises = [];

  for (const service of services) {
    // Validate required fields
    if (!service.title || !service.description || !service.image) {
      return res.status(400).json({ error: 'Each service must have a title, description, and an image object.' });
    }

    if (service.image.data) { // If it's a new image with base64 data
      uploadPromises.push(
        cloudinary.uploader.upload(service.image.data, {
          folder: 'services', // Optional: specify a folder in Cloudinary
          // public_id: service.title.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now(), // Dynamic public_id
        }).then(result => {
          newImagePublicIds.add(result.public_id);
          return {
            title: service.title,
            description: service.description,
            image: {
              src: result.secure_url,
              cloudinaryPublicId: result.public_id,
              alt: service.image.alt || service.title,
            },
          };
        }).catch(uploadError => {
          console.error(`Error uploading image for service "${service.title}":`, uploadError);
          // Fallback to default image on upload failure
          return {
            title: service.title,
            description: service.description,
            image: getDefaultServiceImage(),
          };
        })
      );
    } else if (service.image.src && service.image.src.startsWith('http')) { // If it's an existing Cloudinary image
      newImagePublicIds.add(service.image.cloudinaryPublicId); // Add existing public ID to keep it
      finalServicesData.push({
        title: service.title,
        description: service.description,
        image: {
          src: service.image.src,
          alt: service.image.alt || service.title,
          cloudinaryPublicId: service.image.cloudinaryPublicId || undefined,
        },
      });
    } else { // Fallback for services without image data or valid existing image
      finalServicesData.push({
        title: service.title,
        description: service.description,
        image: getDefaultServiceImage(),
      });
    }
  }

  // Await all Cloudinary uploads
  const uploadedServiceResults = await Promise.all(uploadPromises);
  uploadedServiceResults.forEach(uploadedService => {
    finalServicesData.push(uploadedService);
  });

  // Determine images to delete from Cloudinary
  const publicIdsToDeleteFromCloudinary = [...oldImagePublicIds].filter(
    (publicId) => !newImagePublicIds.has(publicId)
  );

  // Delete old images from Cloudinary
  for (const publicId of publicIdsToDeleteFromCloudinary) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted old image from Cloudinary: ${publicId}`);
    } catch (cloudinaryErr) {
      console.error(`Error deleting image from Cloudinary (${publicId}):`, cloudinaryErr.message);
    }
  }

  page.heading = heading;
  page.services = finalServicesData; // Assign the processed services data
  page.lastUpdated = Date.now();

  try {
    await page.save();
    res.json(page);
  } catch (error) {
    console.error('Error updating services page:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
