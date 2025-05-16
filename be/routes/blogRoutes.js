const express = require('express');
const mongoose = require('mongoose');
const BlogPost = require('../models/BlogPost');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');

const BASE_UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const BLOG_IMAGES_SUBDIR = 'blogs';
const BLOG_UPLOADS_DIR = path.join(BASE_UPLOADS_DIR, BLOG_IMAGES_SUBDIR);

// Ensure directories exist
if (!fs.existsSync(BASE_UPLOADS_DIR)) {
    fs.mkdirSync(BASE_UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(BLOG_UPLOADS_DIR)) {
    fs.mkdirSync(BLOG_UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, BLOG_UPLOADS_DIR);
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
        return res.status(409).json({ success: false, message: "Duplicate key error. A blog post with this title/slug may already exist."});
    }
    if (error instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
    }
    if (error.message && error.message.includes('Not an image')) {
        return res.status(400).json({ success: false, message: 'Not an image! Please upload only images.' });
    }
    return res.status(statusCode).json({ success: false, message: error.message || 'Server Error' });
};

const deleteImageFile = (filenameWithSubdirectory) => {
    if (!filenameWithSubdirectory) return;
    const imagePath = path.join(BASE_UPLOADS_DIR, filenameWithSubdirectory);
    if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
            if (err) console.error(`Error deleting image file ${filenameWithSubdirectory}:`, err);
            else console.log(`Image file ${filenameWithSubdirectory} deleted.`);
        });
    } else {
        console.log(`Image file ${filenameWithSubdirectory} not found for deletion.`);
    }
};

// --- ROUTES ---

// CREATE a new blog post (protected)
router.post('/', auth, upload.single('mainImage'), async (req, res) => {
    try {
        const { title, content, author, status, metaTitle, metaDescription, slug } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required.' });
        }

        const postData = { title, content, author, status, metaTitle, metaDescription, slug };

        if (req.file) {
            postData.mainImage = `${BLOG_IMAGES_SUBDIR}/${req.file.filename}`;
            console.log('Main image uploaded, path stored:', postData.mainImage);
        } else {
            console.log('No main image uploaded for new post.');
        }

        const newBlogPost = new BlogPost(postData);
        const savedPost = await newBlogPost.save();
        res.status(201).json({ success: true, message: 'Blog post created successfully.', data: savedPost });
    } catch (error) {
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
            return res.status(404).json({ success: false, message: 'Blog post not found for update.' });
        }

        const updateData = { title, content, author, status, metaTitle, metaDescription, slug };

        if (req.file) {
            console.log('New main image uploaded for update:', req.file.filename);
            deleteImageFile(postToUpdate.mainImage);
            updateData.mainImage = `${BLOG_IMAGES_SUBDIR}/${req.file.filename}`;
        } else if (req.body.mainImage === '' || req.body.mainImage === null) {
            console.log('Main image marked for removal during update.');
            deleteImageFile(postToUpdate.mainImage);
            updateData.mainImage = null;
        } else {
            console.log('Main image not changed during update.');
            updateData.mainImage = postToUpdate.mainImage;
        }

        const updatedPost = await BlogPost.findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Blog post updated successfully.', data: updatedPost });
    } catch (error) {
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

        deleteImageFile(deletedPost.mainImage);

        res.status(200).json({ success: true, message: 'Blog post deleted successfully.', data: {} });
    } catch (error) {
        handleError(res, error);
    }
});

// Upload editor image (protected)
router.post('/upload-editor-image', auth, upload.single('editorImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided for editor.' });
        }
        console.log('Editor image uploaded:', req.file.filename);
        const imageUrl = `/uploads/${BLOG_IMAGES_SUBDIR}/${req.file.filename}`;
        res.status(200).json({ success: true, message: 'Editor image uploaded successfully.', data: { imageUrl } });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;
