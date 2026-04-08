const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure upload directory exists
const ensureDir = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    console.error('Error creating upload dir:', err);
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
    await ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize filename: remove special chars, prevent path traversal
    const sanitizedName = path.parse(file.originalname).name
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50); // Max 50 chars
    const timestamp = Date.now();
    cb(null, `${timestamp}-${sanitizedName}${path.extname(file.originalname)}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, gif, webp)'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024 // 5MB
};

// Multer middleware instance
const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits
});

// Error handling middleware (optional, but good practice)
uploadMiddleware.singleFileErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Max 5MB allowed.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Only one image allowed.' });
    }
  } else if (err.message === 'Only image files are allowed (jpg, jpeg, png, gif, webp)') {
    return res.status(400).json({ error: err.message });
  }
  // Cleanup temp file if needed, but since we use diskStorage directly, no temp
  next(err);
};

module.exports = { uploadMiddleware };

