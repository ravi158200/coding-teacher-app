const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    videoFile: { type: String }, // Path to uploaded video
    pdfFile: { type: String },   // Path to uploaded PDF notes
    duration: { type: String }
});

const submissionSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lessonIdx: { type: Number },
    fileUrl: { type: String },
    fileType: { type: String, enum: ['video', 'pdf'] },
    comment: { type: String },
    submittedAt: { type: Date, default: Date.now }
});

const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked teacher
    thumbnail: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number }, // For discount display
    isBatch: { type: Boolean, default: false },
    startDate: { type: Date },
    lessons: [lessonSchema],
    quizzes: [quizSchema],
    submissions: [submissionSchema], // Student uploads
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
