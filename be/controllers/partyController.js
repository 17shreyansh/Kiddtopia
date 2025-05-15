const Party = require('../models/Party');
const upload = require('../middleware/uploadMiddleware');

// Get all party settings
exports.getPartySettings = async (req, res) => {
  try {
    let partySettings = await Party.findOne();
    
    // If no settings exist, create default settings
    if (!partySettings) {
      partySettings = await Party.create({
        topSection: {
          heading: 'Parties'
        },
        partySections: [
          {
            title: "Where Every Birthday Adventure Begins!",
            paragraphs: [
              "Celebrate your child's special day at Kiddtopia, where fun meets adventure! Our vibrant indoor play center offers a perfect blend of entertainment for all ages."
            ],
            images: [
              { url: '/uploads/default-party-1.jpg', alt: 'Birthday party' },
              { url: '/uploads/default-party-2.jpg', alt: 'Birthday party' },
              { url: '/uploads/default-party-3.jpg', alt: 'Birthday party' },
              { url: '/uploads/default-party-4.jpg', alt: 'Birthday party' },
              { url: '/uploads/default-party-5.jpg', alt: 'Birthday party' }
            ],
            reverse: false
          },
          {
            title: "Host the Ultimate Kitty Party at Kiddtopia!",
            paragraphs: [
              "Looking for a unique, fun-filled venue to host your next Kitty Party? Kiddtopia offers the perfect mix of entertainment, food, and relaxation for an unforgettable experience."
            ],
            images: [
              { url: '/uploads/default-kitty-1.jpg', alt: 'Kitty party' },
              { url: '/uploads/default-kitty-2.jpg', alt: 'Kitty party' },
              { url: '/uploads/default-kitty-3.jpg', alt: 'Kitty party' },
              { url: '/uploads/default-kitty-4.jpg', alt: 'Kitty party' },
              { url: '/uploads/default-kitty-5.jpg', alt: 'Kitty party' }
            ],
            reverse: true
          },
          // Add other default sections...
        ]
      });
    }
    
    res.status(200).json({
      success: true,
      data: partySettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update party settings
exports.updatePartySettings = async (req, res) => {
  try {
    const { topSection, partySections } = req.body;
    
    let partySettings = await Party.findOne();
    
    // If no settings exist, create new
    if (!partySettings) {
      partySettings = new Party({
        topSection,
        partySections
      });
    } else {
      // Update existing settings
      if (topSection) partySettings.topSection = topSection;
      if (partySections) partySettings.partySections = partySections;
    }
    
    await partySettings.save();
    
    res.status(200).json({
      success: true,
      data: partySettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update a specific party section
exports.updatePartySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const sectionData = req.body;
    
    const partySettings = await Party.findOne();
    
    if (!partySettings) {
      return res.status(404).json({
        success: false,
        message: 'Party settings not found'
      });
    }
    
    // Find the index of the section to update
    const sectionIndex = partySettings.partySections.findIndex(
      section => section._id.toString() === sectionId
    );
    
    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Party section not found'
      });
    }
    
    // Update the section
    partySettings.partySections[sectionIndex] = {
      ...partySettings.partySections[sectionIndex].toObject(),
      ...sectionData
    };
    
    await partySettings.save();
    
    res.status(200).json({
      success: true,
      data: partySettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add a new party section
exports.addPartySection = async (req, res) => {
  try {
    const newSection = req.body;
    
    const partySettings = await Party.findOne();
    
    if (!partySettings) {
      return res.status(404).json({
        success: false,
        message: 'Party settings not found'
      });
    }
    
    partySettings.partySections.push(newSection);
    await partySettings.save();
    
    res.status(201).json({
      success: true,
      data: partySettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a party section
exports.deletePartySection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    
    const partySettings = await Party.findOne();
    
    if (!partySettings) {
      return res.status(404).json({
        success: false,
        message: 'Party settings not found'
      });
    }
    
    // Find the index of the section to delete
    const sectionIndex = partySettings.partySections.findIndex(
      section => section._id.toString() === sectionId
    );
    
    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Party section not found'
      });
    }
    
    // Remove the section
    partySettings.partySections.splice(sectionIndex, 1);
    
    await partySettings.save();
    
    res.status(200).json({
      success: true,
      data: partySettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Upload image for a party section
exports.uploadSectionImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image uploaded'
      });
    }
    
    const { sectionId, imageIndex } = req.params;
    
    const partySettings = await Party.findOne();
    
    if (!partySettings) {
      return res.status(404).json({
        success: false,
        message: 'Party settings not found'
      });
    }
    
    // Find the section
    const sectionIndex = partySettings.partySections.findIndex(
      section => section._id.toString() === sectionId
    );
    
    if (sectionIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Party section not found'
      });
    }
    
    const section = partySettings.partySections[sectionIndex];
    
    // Create the image URL
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Check if we're updating an existing image or adding a new one
    if (imageIndex && imageIndex < section.images.length) {
      // Update existing image
      section.images[imageIndex] = {
        url: imageUrl,
        alt: req.body.alt || section.images[imageIndex].alt || 'Party image'
      };
    } else {
      // Add new image
      section.images.push({
        url: imageUrl,
        alt: req.body.alt || 'Party image'
      });
    }
    
    await partySettings.save();
    
    res.status(200).json({
      success: true,
      data: {
        section: partySettings.partySections[sectionIndex],
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};