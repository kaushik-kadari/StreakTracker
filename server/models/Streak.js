const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    bestStreak: {
        type: Number,
        default: 0
    },
    history: [{
        type: String, // Array of completed dates in ISO format
        default: []
    }],
    lastCompleted: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for streak ID
streakSchema.virtual('id').get(function() {
    return this._id.toString();
});

module.exports = mongoose.model('Streak', streakSchema);
