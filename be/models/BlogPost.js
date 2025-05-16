const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog post title is required.'],
        trim: true,
        maxlength: [150, 'Title cannot be more than 150 characters.']
    },
    content: {
        type: String,
        required: [true, 'Blog post content is required.']
    },
    mainImage: { // Will store path relative to 'uploads/', e.g., 'blogs/image.jpg'
        type: String,
        trim: true,
    },
    author: {
        type: String,
        default: 'Admin',
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    metaTitle: {
        type: String,
        trim: true,
        maxlength: [70, 'Meta title should be around 60-70 characters.']
    },
    metaDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'Meta description should be around 150-160 characters.']
    },
}, { timestamps: true });

blogPostSchema.pre('save', function(next) {
    if (this.isModified('title') || !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;