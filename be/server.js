const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const serverless = require('serverless-http');

const homeRoutes = require('../routes/homeRoutes');
const aboutUsRoutes = require('../routes/aboutUsRoutes');
const partiesPageRoutes = require('../routes/partiesPageRoutes');
const adminRoutes = require('../routes/adminRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutUsRoutes);
app.use('/api/parties', partiesPageRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.send({ success: true, file: req.file });
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Export handler for Vercel
module.exports = app;
module.exports.handler = serverless(app);
