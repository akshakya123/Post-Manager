const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    resumeUrl: {
        type: String,
        required: true,
        trim: true
    },
    coverLetter: {
        type: String, // could be a URL or text
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Interviewed', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    notes: {
        type: String,
        trim: true
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
