const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', enquirySchema);
