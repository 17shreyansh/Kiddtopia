const Blog = require('../models/Blog');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (category) {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.categories = foundCategory._id;
      }
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name email');
      
    const count = await Blog.countDocuments(query);
    
    res.status(200).json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    // Handle main image upload
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: 'Main image is required' });
    }
    
    const mainImage = req.files.mainImage;
    const imageName = `${Date.now()}-${mainImage.name}`;
    const uploadPath = path.join(__dirname, '../public/uploads/', imageName);
    
    await mainImage.mv(uploadPath);
    
    const blogData = {
      ...req.body,
      mainImage: `/uploads/${imageName}`,
      author: req.user._id  // Assuming authentication middleware sets req.user
    };
    
    const blog = new Blog(blogData);
    await blog.save();
    
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }
    
    const updateData = { ...req.body };
    
    // Handle main image update if provided
    if (req.files && req.files.mainImage) {
      // Delete old image
      if (blog.mainImage) {
        const oldImagePath = path.join(__dirname, '../public', blog.mainImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      const mainImage = req.files.mainImage;
      const imageName = `${Date.now()}-${mainImage.name}`;
      const uploadPath = path.join(__dirname, '../public/uploads/', imageName);
      
      await mainImage.mv(uploadPath);
      updateData.mainImage = `/uploads/${imageName}`;
    }
    
    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if user is author or admin
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }
    
    // Delete blog image
    if (blog.mainImage) {
      const imagePath = path.join(__dirname, '../public', blog.mainImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for blog content (React Quill)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    const image = req.files.image;
    const imageName = `${Date.now()}-${image.name}`;
    const uploadPath = path.join(__dirname, '../public/uploads/blog-content/', imageName);
    
    await image.mv(uploadPath);
    
    res.status(200).json({ 
      success: true, 
      url: `/uploads/blog-content/${imageName}` 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

