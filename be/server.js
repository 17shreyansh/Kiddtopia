const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const homeRoutes = require('./routes/homeRoutes'); // Import your home routes
const aboutUsRoutes = require('./routes/aboutUsRoutes');
const partiesPageRoutes = require('./routes/partiesPageRoutes');




dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files (uploaded images) from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';  // Define the directory to store uploaded files
    cb(null, uploadDir);  // Upload to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Save file with a unique timestamp to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/home', homeRoutes);  // Ensure that 'homeRoutes' includes proper routes for section management
app.use('/api/about', aboutUsRoutes);
app.use('/api/parties', partiesPageRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});



// Test route to check if the file is being uploaded
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ success: true, file: req.file });
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
