const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for Avatar Uploads
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/avatars/');
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Upload Avatar
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.avatar = `/uploads/avatars/${req.file.filename}`;
            await user.save();
            res.json({ avatar: user.avatar });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Enroll in course (MOCK Payment success)
router.post('/enroll/:courseId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.enrolledCourses.includes(req.params.courseId)) {
            user.enrolledCourses.push(req.params.courseId);
            await user.save();
        }
        res.json({ message: 'Enrolled successfully', enrolledCourses: user.enrolledCourses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update progress
router.post('/progress/:courseId', protect, async (req, res) => {
    try {
        const { lessonIdx } = req.body;
        const user = await User.findById(req.user._id);
        
        let courseProgress = user.progress.get(req.params.courseId) || [];
        if (!courseProgress.includes(lessonIdx)) {
            courseProgress.push(lessonIdx);
            user.progress.set(req.params.courseId, courseProgress);
            await user.save();
        }
        
        res.json({ message: 'Progress updated', progress: user.progress });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user profile with enrollments
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('enrolledCourses').populate('favorites');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.avatar = req.body.avatar || user.avatar;
            user.bio = req.body.bio || user.bio;
            user.occupation = req.body.occupation || user.occupation;
            user.skills = req.body.skills || user.skills;
            user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
            user.socials = req.body.socials || user.socials;

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─── ADMIN ONLY: USER MANAGEMENT ───────────────────────────────────────────

// Admin: Get all users (with pagination)
router.get('/admin/all', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update user role
router.put('/admin/:id/role', protect, admin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['student', 'teacher', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update user profile details (Complete Edit Control)
router.put('/admin/edit/:id', protect, admin, async (req, res) => {
    try {
        const { name, email, bio, occupation, phoneNumber, role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (bio) user.bio = bio;
        if (occupation) user.occupation = occupation;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (role) {
            if (!['student', 'teacher', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
            user.role = role;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Block/Unblock user
router.put('/admin/:id/block', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked', isBlocked: user.isBlocked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Delete user
router.delete('/admin/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get dashboard stats
router.get('/admin/stats', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);
        res.json({ totalUsers, totalStudents, totalTeachers, totalAdmins, recentUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
