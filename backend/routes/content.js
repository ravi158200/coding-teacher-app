const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const { protect, admin, teacher } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── PUBLIC ROUTES ───────────────────────────────────────────────────────────

// Get all published content (with optional type filter)
router.get('/', async (req, res) => {
    try {
        const filter = { isPublished: true };
        if (req.query.type) filter.type = req.query.type;
        if (req.query.course) filter.course = req.query.course;
        const content = await Content.find(filter).sort({ isPinned: -1, createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single content item & increment views
router.get('/:id', async (req, res) => {
    try {
        const item = await Content.findById(req.params.id).populate('author', 'name avatar');
        if (!item) return res.status(404).json({ message: 'Content not found' });
        item.views += 1;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// Admin: Get ALL content (including unpublished)
router.get('/admin/all', protect, teacher, async (req, res) => {
    try {
        const filter = {};
        if (req.query.type) filter.type = req.query.type;
        // Teachers see only their own; admins see all
        if (req.user.role === 'teacher') filter.author = req.user._id;
        const content = await Content.find(filter).sort({ createdAt: -1 });
        res.json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin/Teacher: Create content
router.post('/', protect, teacher, async (req, res) => {
    try {
        const item = await Content.create({
            ...req.body,
            author: req.user._id,
            authorName: req.user.name,
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin/Teacher: Upload video file for content
router.post('/:id/upload-video', protect, teacher, upload.single('file'), async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Content not found' });
        item.videoFile = `/uploads/videos/${req.file.filename}`;
        if (!item.thumbnail) item.thumbnail = '';
        await item.save();
        res.json({ message: 'Video uploaded', videoFile: item.videoFile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin/Teacher: Upload notes (PDF) for content
router.post('/:id/upload-pdf', protect, teacher, upload.single('file'), async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Content not found' });
        item.pdfFile = `/uploads/notes/${req.file.filename}`;
        await item.save();
        res.json({ message: 'Notes uploaded', pdfFile: item.pdfFile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin/Teacher: Upload thumbnail for content
router.post('/:id/upload-thumbnail', protect, teacher, upload.single('file'), async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Content not found' });
        item.thumbnail = `/uploads/${req.file.filename}`;
        await item.save();
        res.json({ message: 'Thumbnail uploaded', thumbnail: item.thumbnail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin/Teacher: Update content
router.put('/:id', protect, teacher, async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Content not found' });
        // Only owner or admin can update
        if (req.user.role !== 'admin' && item.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updated = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin only: Delete content
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Content.findByIdAndDelete(req.params.id);
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Student: Enroll in a live class
router.post('/:id/enroll', protect, async (req, res) => {
    try {
        const item = await Content.findById(req.params.id);
        if (!item || item.type !== 'class') return res.status(404).json({ message: 'Class not found' });
        if (!item.enrolledStudents.includes(req.user._id)) {
            item.enrolledStudents.push(req.user._id);
            await item.save();
        }
        res.json({ message: 'Enrolled in class', enrolledStudents: item.enrolledStudents });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
