const Section = require('../models/Home');
const sectionSchemas = require('../validators/homeSchemas');
const cloudinary = require('cloudinary').v2; // Import Cloudinary

// Configure Cloudinary (ensure these are loaded from environment variables)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Utility to delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        // Cloudinary URLs typically look like:
        // https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id_with_folders>.<extension>
        // We need to extract the <public_id_with_folders> part.
        const urlParts = imageUrl.split('/');
        const uploadIndex = urlParts.indexOf('upload');

        if (uploadIndex === -1 || urlParts.length <= uploadIndex + 1) {
            console.error(`Invalid Cloudinary URL format for deletion: ${imageUrl}`);
            return;
        }

        // Get the path segment after 'upload' and version (e.g., 'v12345')
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.')); // Remove file extension

        console.log(`Attempting to delete Cloudinary image with public_id: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            console.log(`Cloudinary image ${publicId} deleted successfully.`);
        } else {
            console.error(`Error deleting Cloudinary image ${publicId}:`, result);
        }
    } catch (err) {
        console.error(`Error during Cloudinary image deletion for URL ${imageUrl}:`, err);
    }
};

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
    let uploadedCloudinaryUrl = null; // To track for rollback on error

    // Check if the section schema exists
    if (!schema) {
        return res.status(400).json({ error: 'Invalid section name' });
    }

    try {
        // Parse content from the request body
        let parsedData;
        try {
            // If content is sent as a stringified JSON, parse it
            parsedData = JSON.parse(req.body.content);
        } catch (e) {
            // If it's not JSON, assume it's directly usable if schema allows (unlikely for complex content)
            // Or return an error if strict JSON is expected
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

        // Handle main image upload if provided
        if (req.file) {
            console.log('Uploading main image to Cloudinary...');
            // Upload buffer to Cloudinary
            const cloudinaryUploadResult = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                {
                    folder: 'home_section_images', // Cloudinary folder for home section images
                }
            );
            uploadedCloudinaryUrl = cloudinaryUploadResult.secure_url;
            update.image = uploadedCloudinaryUrl; // Store Cloudinary URL

            // If updating the main image and there's an existing one, delete the old Cloudinary image
            if (existingSection && existingSection.image) {
                await deleteImageFromCloudinary(existingSection.image);
            }
            console.log(`Main image uploaded: ${uploadedCloudinaryUrl}`);
        } else if (req.body.image === '' || req.body.image === null) {
            // Client explicitly wants to remove the main image
            if (existingSection && existingSection.image) {
                await deleteImageFromCloudinary(existingSection.image);
            }
            update.image = null; // Set image to null in DB
            console.log('Main image removed.');
        } else {
            // No new file, and not explicitly removed, retain existing image
            update.image = existingSection ? existingSection.image : null;
            console.log('Main image not changed.');
        }

        // Handle image arrays for specific sections (e.g., Gallery items)
        if (['Why Choose Us', 'Gallery', 'Our Partners', 'About Us'].includes(sectionName)) {
            // Check if there was an uploaded file (for adding to array)
            if (req.file) {
                // Ensure parsedData.images is an array
                if (!parsedData.images || !Array.isArray(parsedData.images)) {
                    parsedData.images = [];
                }
                // Add the new Cloudinary URL to the images array
                parsedData.images.push(uploadedCloudinaryUrl);
                // Update the content with the modified images array
                update.content = parsedData;
                console.log(`Image added to array for section ${sectionName}: ${uploadedCloudinaryUrl}`);
            }
            // If the client sends an updated `content.images` array in `req.body.content`
            // and it differs from existing, we need to handle deletions.
            // This assumes the client will send the *full* updated array.
            // A more robust solution might involve a separate route/logic for array image deletions.
            // For now, we'll assume the client is responsible for sending the correct, current array,
            // and `deleteImage` handles specific array image removal.
        }


        // Update or create the section in the database
        const updatedSection = await Section.findOneAndUpdate(
            { sectionName },
            update,
            { upsert: true, new: true }
        );

        res.json({ success: true, data: updatedSection });
    } catch (error) {
        // If an error occurs after Cloudinary upload but before DB save, delete the uploaded image
        if (uploadedCloudinaryUrl) {
            await deleteImageFromCloudinary(uploadedCloudinaryUrl);
        }
        console.error("Error updating section:", error);
        res.status(500).json({ error: 'Failed to update section', details: error.message });
    }
};

// Delete an image from a section (specifically from image arrays or main image)
exports.deleteImage = async (req, res) => {
    const { sectionName, imageName } = req.params; // imageName will be the Cloudinary URL

    try {
        const section = await Section.findOne({ sectionName });

        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        let imageDeleted = false;

        // Case 1: Deleting a main image for the section
        if (section.image && section.image === imageName) {
            await deleteImageFromCloudinary(section.image);
            section.image = null; // Set to null in DB
            imageDeleted = true;
            console.log(`Main image ${imageName} deleted from section ${sectionName}.`);
        }
        // Case 2: Deleting an image from an array within content
        else if (section.content && section.content.images && Array.isArray(section.content.images)) {
            const imageIndex = section.content.images.indexOf(imageName);
            if (imageIndex !== -1) {
                await deleteImageFromCloudinary(section.content.images[imageIndex]);
                section.content.images.splice(imageIndex, 1); // Remove from array
                imageDeleted = true;
                console.log(`Array image ${imageName} deleted from section ${sectionName}.`);
            }
        }

        if (!imageDeleted) {
            return res.status(404).json({ error: 'Image not found in section or its image array' });
        }

        await section.save();
        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: 'Failed to delete image', details: error.message });
    }
};
