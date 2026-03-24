const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_123', { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, regNumber } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ 
            name, 
            email, 
            password,
            phoneNumber: phone,
            regNumber
        });
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                phoneNumber: user.phoneNumber,
                regNumber: user.regNumber,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                phoneNumber: user.phoneNumber,
                regNumber: user.regNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email, phoneNumber, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with this email address.' });

        // Only verify phone if the user HAS a phone number saved on their profile
        const storedPhone = (user.phoneNumber || '').replace(/\D/g, '').slice(-10);
        if (storedPhone) {
            const inputPhone = (phoneNumber || '').replace(/\D/g, '').slice(-10);
            if (!inputPhone) {
                return res.status(400).json({ message: 'Please enter the phone number linked to your account.' });
            }
            if (storedPhone !== inputPhone) {
                return res.status(401).json({ message: 'Phone number does not match our records. Please try again.' });
            }
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
