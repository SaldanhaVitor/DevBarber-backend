const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true
    },
    available: {
        type: Array,
        required: true,
        date: {
            type: Date,
            required: true
        },
        hours: {
            type: String,
            required: true
        }
    }
});

module.exports = mongoose.model('Availability', AvailabilitySchema);
