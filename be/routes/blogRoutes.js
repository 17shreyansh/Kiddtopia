const express = require('express');
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Still needed for temporary file deletion
const cloudinary = require('cloudinary').v2;
const auth = require('../middleware/authMiddleware'); // Assuming this path is correct

// Configure Cloudinary (Replace with your actual Cloudinary credentials or environment variables)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer for temporary disk storage
// We will upload from disk to Cloudinary and then delete the local file.
const UPLOADS_TEMP_DIR = path.join(__dirname, '..', 'temp_uploads');

// Ensure temporary directory exists
if (!fs.existsSync(UPLOADS_TEMP_DIR)) {
    fs.mkdirSync(UPLOADS_TEMP_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_TEMP_DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB
    },
    fileFilter: fileFilter
});

const router = express.Router();

const handleError = (res, error, statusCode = 500) => {
    console.error("Error details:", error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: "Validation Error", errors: messages });
    }
    if (error.code === 11000) {
        return res.status(409).json({ success: false, message: "Duplicate key error. A blog post with this title/slug may already exist." });
    }
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
    }
    if (error.message && error.message.includes('Not an image')) {
        return res.status(400).json({ success: false, message: 'Not an image! Please upload only images.' });
    }
    return res.status(statusCode).json({ success: false, message: error.message || 'Server Error' });
};

// Utility to delete a local temporary file
const deleteLocalFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Error deleting local temporary file ${filePath}:`, err);
            else console.log(`Local temporary file ${filePath} deleted.`);
        });
    }
};

// Utility to delete image from Cloudinary
const deleteImageFromCloudinary = async (imageUrl) => {
    if (!imageUrl) return;

    try {
        const urlParts = imageUrl.split('/');
        // Find the index of 'upload' which usually precedes version and public_id
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1 || urlParts.length <= uploadIndex + 1) {
            console.error(`Invalid Cloudinary URL format for deletion: ${imageUrl}`);
            return;
        }

        // The public_id is usually the part after the version, before the file extension
        // and includes any folder path specified during upload.
        // Example: .../upload/v12345/folder/image_name.jpg
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/'); // Get everything after 'upload/vXXX'
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

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

// --- ROUTES ---

// CREATE a new blog post (protected)
router.post('/', auth, upload.single('mainImage'), async (req, res) => {
    let uploadedCloudinaryUrl = null; // To keep track for cleanup
    try {
        const { title, content, author, status, metaTitle, metaDescription, slug } = req.body;

        if (!title || !content) {
            if (req.file && req.file.path) {
                deleteLocalFile(req.file.path); // Clean up local temp file
            }
            return res.status(400).json({ success: false, message: 'Title and content are required.' });
        }

        const postData = { title, content, author, status, metaTitle, metaDescription, slug };

        if (req.file) {
            console.log('Uploading main image to Cloudinary from local path:', req.file.path);
            const cloudinaryUploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog_images' // Specify a folder in Cloudinary
            });
            uploadedCloudinaryUrl = cloudinaryUploadResult.secure_url;
            postData.mainImage = uploadedCloudinaryUrl;
            console.log('Main image uploaded to Cloudinary, URL stored:', postData.mainImage);
            deleteLocalFile(req.file.path); // Clean up local temporary file after successful upload
        } else {
            console.log('No main image uploaded for new post.');
        }

        const newBlogPost = new BlogPost(postData);
        const savedPost = await newBlogPost.save();
        res.status(201).json({ success: true, message: 'Blog post created successfully.', data: savedPost });
    } catch (error) {
        // If an error occurs during save, clean up locally uploaded file and Cloudinary image if uploaded
        if (req.file && req.file.path) {
            deleteLocalFile(req.file.path);
        }
        if (uploadedCloudinaryUrl) {
            await deleteImageFromCloudinary(uploadedCloudinaryUrl); // Rollback Cloudinary upload
        }
        handleError(res, error);
    }
});

// READ all blog posts (public)
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        handleError(res, error);
    }
});

// READ single blog post by ID or slug (public)
router.get('/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        let post;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            post = await BlogPost.findById(identifier);
        }
        if (!post) {
            post = await BlogPost.findOne({ slug: identifier });
        }
        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog post not found.' });
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        handleError(res, error);
    }
});

// UPDATE blog post by ID or slug (protected)
router.put('/:identifier', auth, upload.single('mainImage'), async (req, res) => {
    let uploadedCloudinaryUrl = null; // To keep track for cleanup
    try {
        const { identifier } = req.params;
        const { title, content, author, status, metaTitle, metaDescription, slug } = req.body;

        let query;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier };
        } else {
            query = { slug: identifier };
        }

        const postToUpdate = await BlogPost.findOne(query);
        if (!postToUpdate) {
            if (req.file && req.file.path) {
                deleteLocalFile(req.file.path); // Clean up local temp file
            }
            return res.status(404).json({ success: false, message: 'Blog post not found for update.' });
        }

        const updateData = { title, content, author, status, metaTitle, metaDescription, slug };

        if (req.file) {
            console.log('New main image uploaded to Cloudinary from local path:', req.file.path);
            // Delete old image from Cloudinary if it exists
            if (postToUpdate.mainImage) {
                await deleteImageFromCloudinary(postToUpdate.mainImage);
            }
            const cloudinaryUploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog_images' // Specify a folder in Cloudinary
            });
            uploadedCloudinaryUrl = cloudinaryUploadResult.secure_url;
            updateData.mainImage = uploadedCloudinaryUrl; // New Cloudinary URL
            deleteLocalFile(req.file.path); // Clean up local temporary file after successful upload
        } else if (req.body.mainImage === '' || req.body.mainImage === null) {
            console.log('Main image marked for removal during update.');
            // Delete old image from Cloudinary if it exists
            if (postToUpdate.mainImage) {
                await deleteImageFromCloudinary(postToUpdate.mainImage);
            }
            updateData.mainImage = null; // Set to null in DB
        } else {
            console.log('Main image not changed during update, retaining existing URL.');
            updateData.mainImage = postToUpdate.mainImage; // Retain existing image URL
        }

        const updatedPost = await BlogPost.findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Blog post updated successfully.', data: updatedPost });
    } catch (error) {
        // If an error occurs during update, clean up locally uploaded file and Cloudinary image if uploaded
        if (req.file && req.file.path) {
            deleteLocalFile(req.file.path);
        }
        if (uploadedCloudinaryUrl) {
            await deleteImageFromCloudinary(uploadedCloudinaryUrl); // Rollback Cloudinary upload
        }
        handleError(res, error);
    }
});

// DELETE blog post by ID or slug (protected)
router.delete('/:identifier', auth, async (req, res) => {
    try {
        const { identifier } = req.params;
        let query;
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier };
        } else {
            query = { slug: identifier };
        }

        const deletedPost = await BlogPost.findOneAndDelete(query);
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: 'Blog post not found for deletion.' });
        }

        // Delete associated image from Cloudinary
        if (deletedPost.mainImage) {
            await deleteImageFromCloudinary(deletedPost.mainImage);
        }

        res.status(200).json({ success: true, message: 'Blog post deleted successfully.', data: {} });
    } catch (error) {
        handleError(res, error);
    }
});

// Upload editor image (protected) - This assumes the editor sends an image with field name 'editorImage'
router.post('/upload-editor-image', auth, upload.single('editorImage'), async (req, res) => {
    let uploadedCloudinaryUrl = null; // To keep track for cleanup
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided for editor.' });
        }

        console.log('Uploading editor image to Cloudinary from local path:', req.file.path);
        const cloudinaryUploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog_editor_images' // Separate folder for editor images
        });
        uploadedCloudinaryUrl = cloudinaryUploadResult.secure_url;
        console.log('Editor image uploaded to Cloudinary, URL stored:', uploadedCloudinaryUrl);
        deleteLocalFile(req.file.path); // Clean up local temporary file after successful upload

        res.status(200).json({ success: true, message: 'Editor image uploaded successfully.', data: { imageUrl: uploadedCloudinaryUrl } });
    } catch (error) {
        // If an error occurs, clean up locally uploaded file and Cloudinary image if uploaded
        if (req.file && req.file.path) {
            deleteLocalFile(req.file.path);
        }
        if (uploadedCloudinaryUrl) {
            await deleteImageFromCloudinary(uploadedCloudinaryUrl); // Rollback Cloudinary upload
        }
        handleError(res, error);
    }
});

module.exports = router;