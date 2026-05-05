const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = new Set([
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.jfif', '.bmp', '.svg', '.avif', '.heic', '.heif'
  ]);

  const extension = path.extname(file.originalname).toLowerCase();
  const isImageMime = typeof file.mimetype === 'string' && file.mimetype.startsWith('image/');
  const isAllowedExtension = allowedExtensions.has(extension);

  if (isImageMime || isAllowedExtension) {
    return cb(null, true);
  }

  cb(new Error('Only image files are allowed!'));
};

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;
