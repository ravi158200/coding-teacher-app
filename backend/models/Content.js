const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['article', 'announcement', 'video', 'class'], default: 'article' },
    body: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    videoUrl: { type: String, default: '' },    // YouTube/Vimeo embed or direct URL
    videoFile: { type: String, default: '' },   // Uploaded video file path
    pdfFile: { type: String, default: '' },     // Uploaded PDF/notes path
    tags: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'Admin' },
    views: { type: Number, default: 0 },
    // For class type
    classDate: { type: Date },
    classDuration: { type: String, default: '' },
    classLink: { type: String, default: '' },
    maxStudents: { type: Number, default: 0 },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } // Linked course/batch
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
