// controllers/blogController.js
const Blog = require('../models/BlogPost'); // Assuming your Blog Mongoose model
const Category = require('../models/Category'); // Assuming your Category Mongoose model
const cloudinary = require('cloudinary').v2; // Cloudinary SDK

// Configure Cloudinary
// IMPORTANT: Replace with your actual Cloudinary credentials.
// It's highly recommended to use environment variables for these.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
});

// Get all blogs with pagination, filtering, and search
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;

    const query = {};

    // Filter by status if provided
    if (status) query.status = status;

    // Filter by category slug if provided
    if (category) {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.categories = foundCategory._id;
      }
    }

    // Search by title, content, or excerpt if search term is provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive title search
        { content: { $regex: search, $options: 'i' } }, // Case-insensitive content search
        { excerpt: { $regex: search, $options: 'i' } }  // Case-insensitive excerpt search
      ];
    }

    // Fetch blogs with pagination and sorting
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(parseInt(limit)) // Apply limit
      .skip((parseInt(page) - 1) * parseInt(limit)) // Apply skip for pagination
      .populate('author', 'name email'); // Populate author details

    // Get total count for pagination metadata
    const count = await Blog.countDocuments(query);

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    res.status(500).json({ message: 'Failed to retrieve blogs.', error: error.message });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email'); // Populate author details

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error in getBlogBySlug:', error);
    res.status(500).json({ message: 'Failed to retrieve blog.', error: error.message });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    // Check if main image was uploaded. Multer uses req.file for single file uploads.
    if (!req.file) {
      return res.status(400).json({ message: 'Main image is required.' });
    }

    let uploadedMainImage;
    try {
      // Upload the main image to Cloudinary using the buffer from Multer's memoryStorage
      uploadedMainImage = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: 'blog_main_images', // Cloudinary folder for blog main images
          // You can add more options like `public_id`, `transformation`, etc.
        }
      );
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error during createBlog:', cloudinaryError);
      return res.status(500).json({ message: 'Failed to upload main image to Cloudinary.', error: cloudinaryError.message });
    }

    const blogData = {
      ...req.body,
      mainImage: uploadedMainImage.secure_url, // Store the secure URL
      mainImagePublicId: uploadedMainImage.public_id, // Store Cloudinary public ID for later deletion
      author: req.user._id // Assuming authentication middleware sets req.user
    };

    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    console.error('Error in createBlog:', error);
    res.status(500).json({ message: 'Failed to create blog.', error: error.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is authorized (author or admin)
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const updateData = { ...req.body };

    // Handle main image update if a new file is provided
    if (req.file) {
      let uploadedMainImage;
      try {
        // Upload the new image to Cloudinary
        uploadedMainImage = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
          {
            folder: 'blog_main_images',
          }
        );
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error during updateBlog:', cloudinaryError);
        return res.status(500).json({ message: 'Failed to upload new main image to Cloudinary.', error: cloudinaryError.message });
      }

      // If there was an old image, destroy it from Cloudinary using its public ID
      if (blog.mainImagePublicId) {
        try {
          await cloudinary.uploader.destroy(blog.mainImagePublicId);
          console.log(`Old main image ${blog.mainImagePublicId} deleted from Cloudinary.`);
        } catch (destroyError) {
          console.warn(`Could not delete old main image ${blog.mainImagePublicId} from Cloudinary:`, destroyError.message);
        }
      }

      // Update with new image URL and public ID
      updateData.mainImage = uploadedMainImage.secure_url;
      updateData.mainImagePublicId = uploadedMainImage.public_id;
    }
    // If the client explicitly sent an empty string or null for mainImage, remove it
    else if (req.body.mainImage === '' || req.body.mainImage === null) {
        if (blog.mainImagePublicId) {
            try {
                await cloudinary.uploader.destroy(blog.mainImagePublicId);
                console.log(`Main image ${blog.mainImagePublicId} removed by user request from Cloudinary.`);
            } catch (destroyError) {
                console.warn(`Could not delete main image ${blog.mainImagePublicId} during removal request:`, destroyError.message);
            }
        }
        updateData.mainImage = null;
        updateData.mainImagePublicId = null;
    }


    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error in updateBlog:', error);
    res.status(500).json({ message: 'Failed to update blog.', error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is authorized (author or admin)
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    // Delete blog main image from Cloudinary if it exists
    if (blog.mainImagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.mainImagePublicId);
        console.log(`Blog main image ${blog.mainImagePublicId} deleted from Cloudinary.`);
      } catch (destroyError) {
        console.warn(`Could not delete blog main image ${blog.mainImagePublicId} from Cloudinary:`, destroyError.message);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    res.status(500).json({ message: 'Failed to delete blog.', error: error.message });
  }
};

// Upload image for blog content (e.g., from a rich text editor like React Quill)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded.' });
    }

    let uploadedEditorImage;
    try {
      // Upload the editor image to Cloudinary
      uploadedEditorImage = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: 'blog_content_images', // Cloudinary folder for editor images
          // You might want to generate a unique public_id or use a transformation here
        }
      );
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error during uploadImage (editor):', cloudinaryError);
      return res.status(500).json({ message: 'Failed to upload editor image to Cloudinary.', error: cloudinaryError.message });
    }

    res.status(200).json({
      success: true,
      url: uploadedEditorImage.secure_url, // Return the Cloudinary URL
      publicId: uploadedEditorImage.public_id // Optionally return public ID if needed for management
    });
  } catch (error) {
    console.error('Error in uploadImage (editor):', error);
    res.status(500).json({ message: 'Failed to upload image for blog content.', error: error.message });
  }
};
