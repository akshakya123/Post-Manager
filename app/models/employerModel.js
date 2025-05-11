const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    established: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    industry: {
        type: String,
        trim: true
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
        default: '1-10'
    },
    description: {
        type: String,
        trim: true
    },
    logoUrl: {
        type: String,
        trim: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    contactEmail: {
        type: String,
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
    socialLinks: {
        linkedIn: { type: String, trim: true },
        twitter: { type: String, trim: true },
        facebook: { type: String, trim: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Employer', employerSchema);