const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    numberOfSeats: {
        type: Number,
        required: true,
        min: 1
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    jobType: {
        type: String,
        enum: ['Full-Time', 'Part-Time', 'Remote', 'Hybrid', 'Contract'],
        required: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'RS'
    },
    workTime: {
        type: String,
        required: true
    },
    workingDaysPerWeek: {
        type: Number,
        required: true,
        min: 1,
        max: 7
    },
    qualifications: {
        type: [String],
        default: []
    },
    experienceRequired: {
        type: String,
        default: '0-1 years' // or use enum/number ranges
    },
    skillsRequired: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        required: true
    },
    responsibilities: {
        type: [String],
        default: []
    },
    benefits: {
        type: [String],
        default: []
    },
    applicationDeadline: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Paused'],
        default: 'Open'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model('Job', jobSchema);
