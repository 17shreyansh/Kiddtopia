const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const cloudinary = require('cloudinary').v2; // Ensure Cloudinary is imported

const homeRoutes = require('./routes/homeRoutes');
const aboutUsRoutes = require('./routes/aboutUsRoutes');
const partyRoutes = require('./routes/partyPageRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const galleryRoutes = require('./routes/galleryroutes');
const contactRoutes = require('./routes/contactRoutes');
const franchiseFormRoutes = require('./routes/franchiseFormRoutes');
const blogRoutes = require('./routes/blogRoutes');
const bookingRoutes = require('./routes/bookings');
const newsletter = require('./routes/newsletter');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// --- NEW: Cloudinary Rewrite Middleware for existing /uploads images ---
// This middleware intercepts requests to /uploads and redirects them to Cloudinary.
// This means your frontend can continue to request 'www.myhosting.com/uploads/image.jpg'
// and your server will transparently tell the browser to fetch it from Cloudinary.
app.use('/uploads', (req, res, next) => {
  // Extract the filename from the requested URL (e.g., 'image.jpg' from '/uploads/image.jpg')
  const filename = req.path.substring(1); // Remove leading slash

  if (filename) {
    // Construct the Cloudinary auto-upload URL
    // Make sure 'your_cloud_name' and 'my_legacy_uploads' match your Cloudinary settings
    const cloudinaryAutoUploadUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/my_legacy_uploads/${filename}`;

    // Redirect the request to Cloudinary.
    // A 302 (Found) is a temporary redirect, allowing old URLs to be re-checked later.
    // A 301 (Moved Permanently) could also be used if you want browsers to update their cached links.
    // For a migration, 302 is safer initially.
    console.log(`Redirecting /uploads/${filename} to Cloudinary: ${cloudinaryAutoUploadUrl}`);
    return res.redirect(302, cloudinaryAutoUploadUrl);
  }
  // If no filename is present (e.g., just /uploads), let the request fall through
  // (though in your case, this path won't be hit if you use the specific image upload route below).
  next();
});

// Setup multer for temporary file uploads before sending to Cloudinary (for *NEW* uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempUploadDir = 'temp-uploads';
    if (!fs.existsSync(tempUploadDir)) {
      fs.mkdirSync(tempUploadDir);
    }
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutUsRoutes);
app.use('/api/parties', partyRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/services', servicesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/franchiseforms', franchiseFormRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/newsletter', newsletter);

// --- Modified /uploads POST route to use Cloudinary for *NEW* uploads ---
app.post('/uploads', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const originalFilename = req.file.originalname;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "your_website_images_new", // Use a different folder for NEW uploads to distinguish from legacy
      public_id: path.parse(originalFilename).name + '-' + Date.now(),
      unique_filename: false,
      overwrite: false,
    });

    fs.unlinkSync(filePath); // Delete temp file

    res.json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully!',
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    res.status(500).json({ success: false, message: 'Image upload failed.', error: error.message });
  }
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
