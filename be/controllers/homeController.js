const Section = require('../models/Home');
const sectionSchemas = require('../validators/homeSchemas');
const fs = require('fs');
const path = require('path');

// Get a section by name
exports.getSection = async (req, res) => {
  const { sectionName } = req.params;

  try {
    const section = await Section.findOne({ sectionName });
    
    // Return an empty object if section doesn't exist yet
    if (!section) {
      return res.json({ success: true, content: {}, image: null });
    }

    res.json({ success: true, content: section.content, image: section.image || null });
  } catch (error) {
    console.error("Error fetching section:", error);
    res.status(500).json({ error: 'Error fetching section data', details: error.message });
  }
};

// Update a section
exports.updateSection = async (req, res) => {
  const { sectionName } = req.params;
  const schema = sectionSchemas[sectionName];

  // Check if the section schema exists
  if (!schema) {
    return res.status(400).json({ error: 'Invalid section name' });
  }

  try {
    // Parse content from the request body
    let parsedData;
    try {
      parsedData = JSON.parse(req.body.content);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON content' });
    }

    // Validate parsed content with the corresponding schema
    const result = schema.safeParse(parsedData);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Invalid content format',
        details: result.error.errors,
      });
    }

    // Get existing section to handle image updates
    const existingSection = await Section.findOne({ sectionName });
    
    // Prepare update object
    const update = { 
      content: parsedData 
    };
    
    // Handle image upload if provided
    if (req.file) {
      update.image = req.file.filename;
      
      // If updating the image and there's an existing one, delete the old file
      if (existingSection && existingSection.image) {
        try {
          const oldImagePath = path.join(__dirname, '..', 'uploads', existingSection.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log(`Deleted old image: ${existingSection.image}`);
          }
        } catch (err) {
          console.warn(`Failed to delete old image: ${err.message}`);
          // Don't stop the process if image deletion fails
        }
      }
    }
    
    // Handle image arrays for specific sections
    if (['Why Choose Us', 'Gallery', 'Our Partners','About Us'].includes(sectionName) && req.file) {
      // Initialize the images array if it doesn't exist
      if (!parsedData.images) {
        parsedData.images = [];
      }
      
      // Add the new image filename to the images array
      parsedData.images.push(req.file.filename);
      
      // Update the content with the modified images array
      update.content = parsedData;
    }

    // Update or create the section in the database
    const updatedSection = await Section.findOneAndUpdate(
      { sectionName },
      update,
      { upsert: true, new: true }
    );

    res.json({ success: true, data: updatedSection });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ error: 'Failed to update section', details: error.message });
  }
};

// Delete an image from a section
exports.deleteImage = async (req, res) => {
  const { sectionName, imageName } = req.params;
  
  try {
    // Get existing section
    const section = await Section.findOne({ sectionName });
    
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    
    // Check if this section has images array
    if (!section.content.images || !Array.isArray(section.content.images)) {
      return res.status(400).json({ error: 'Section does not have image array' });
    }
    
    // Check if image exists in the array
    const imageIndex = section.content.images.indexOf(imageName);
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image not found in section' });
    }
    
    // Remove image from array
    section.content.images.splice(imageIndex, 1);
    
    // Save updated section
    await section.save();
    
    // Delete the file from uploads directory
    try {
      const imagePath = path.join(__dirname, '..', 'uploads', imageName);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    } catch (err) {
      console.warn(`Failed to delete image file: ${err.message}`);
      // Continue even if file deletion fails
    }
    
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: 'Failed to delete image', details: error.message });
  }
};