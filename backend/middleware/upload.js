const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, 'uploads/videos/');
        } else if (file.mimetype === 'application/pdf') {
            cb(null, 'uploads/notes/');
        } else {
            cb(null, 'uploads/');
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/mp4', 'application/pdf', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

module.exports = upload;
