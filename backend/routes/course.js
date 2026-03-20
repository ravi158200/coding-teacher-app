const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect, admin, teacher } = require('../middleware/auth');
const User = require('../models/User');
const upload = require('../middleware/upload');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) res.json(course);
        else res.status(404).json({ message: 'Course not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Save/Unsave favorite course
router.post('/:id/favorite', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const index = user.favorites.indexOf(req.params.id);
        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(req.params.id);
        }
        await user.save();
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Teacher: Create Course
router.post('/', protect, teacher, async (req, res) => {
    try {
        const { title, description, instructor, thumbnail, category, price, originalPrice, isBatch, startDate, lessons, quizzes } = req.body;
        const course = await Course.create({
            title, description, instructor, teacher: req.user._id, thumbnail, category, price, originalPrice, isBatch, startDate, lessons, quizzes
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Teacher: Upload Course Thumbnail Image
router.post('/:id/thumbnail', protect, teacher, upload.single('file'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        const thumbnailUrl = `/uploads/${req.file.filename}`;
        course.thumbnail = thumbnailUrl;
        await course.save();
        res.json({ message: 'Thumbnail uploaded successfully', thumbnailUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Teacher: Upload File to Lesson (Video or PDF)
router.post('/:id/lessons/:lessonIdx/upload', protect, teacher, upload.single('file'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        const lesson = course.lessons[req.params.lessonIdx];
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

        const fileUrl = `/uploads/${req.file.mimetype.startsWith('video/') ? 'videos' : 'notes'}/${req.file.filename}`;
        
        if (req.file.mimetype.startsWith('video/')) {
            lesson.videoFile = fileUrl;
        } else {
            lesson.pdfFile = fileUrl;
        }

        await course.save();
        res.json({ message: 'File uploaded successfully', fileUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student: Upload Submission (Video or PDF)
router.post('/:id/submissions', protect, upload.single('file'), async (req, res) => {
    try {
        const { lessonIdx, comment } = req.body;
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        const fileUrl = `/uploads/${req.file.mimetype.startsWith('video/') ? 'videos' : 'notes'}/${req.file.filename}`;
        const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'pdf';

        course.submissions.push({
            student: req.user._id,
            lessonIdx,
            fileUrl,
            fileType,
            comment
        });

        await course.save();
        res.json({ message: 'Submission uploaded successfully', fileUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin/Teacher: Update Course
router.put('/:id', protect, teacher, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        // Ensure only the teacher who created it or an admin can update
        if (req.user.role !== 'admin' && course.teacher.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this course' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Delete Course
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (course) res.json({ message: 'Course removed' });
        else res.status(404).json({ message: 'Course not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
