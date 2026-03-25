const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const courseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'courses',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 450, crop: 'fill' }]
  }
});

const resourceStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resources',
    resource_type: 'auto', // Allows non-image files like PDFs and videos
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf', 'mp4', 'mkv', 'zip']
  }
});

const uploadAvatar = multer({ storage: avatarStorage });
const uploadCourse = multer({ storage: courseStorage });
const uploadResource = multer({ storage: resourceStorage });

module.exports = { cloudinary, uploadAvatar, uploadCourse, uploadResource };
