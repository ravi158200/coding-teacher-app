const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { protect } = require('../middleware/auth');

// Submit enquiry
router.post('/', async (req, res) => {
    try {
        const { name, email, course, phone, message } = req.body;
        const enquiry = await Enquiry.create({ name, email, course, phone, message });
        res.status(201).json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all enquiries (Admin only)
router.get('/', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const enquiries = await Enquiry.find().sort('-createdAt');
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update enquiry status (Admin only)
router.put('/:id', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
