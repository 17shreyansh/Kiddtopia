const express = require('express');
const router = express.Router();
const ServicesPage = require('../models/Service');
const upload = require('../middleware/uploadMiddleware'); // Your multer middleware

// Get services page data
router.get('/', async (req, res) => {
  const page = await ServicesPage.findOne();
  res.json(page);
});

// Update services page (heading and all services)
router.put('/', upload.array('images'), async (req, res) => {
  const { heading, services } = req.body;
  let parsedServices = JSON.parse(services);

  // Assign images: match files to services with newImage
  if (req.files && req.files.length) {
    let fileIdx = 0;
    parsedServices = parsedServices.map((service) => {
      if (service.newImage) {
        service.image = req.files[fileIdx].filename;
        fileIdx++;
      }
      // Remove the newImage property before saving to DB
      delete service.newImage;
      return service;
    });
  }

  // Ensure every service has an image
  for (const service of parsedServices) {
    if (!service.image) {
      return res.status(400).json({ error: 'All services must have an image.' });
    }
  }

  let page = await ServicesPage.findOne();
  if (!page) page = new ServicesPage();

  page.heading = heading;
  page.services = parsedServices;

  await page.save();
  res.json(page);
});

module.exports = router;
