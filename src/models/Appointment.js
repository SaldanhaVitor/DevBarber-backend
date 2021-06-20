const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: Number,
        required: true
    },
    barber: {
        type: Object,
        required: true
    },
    service: {
        type: Object,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    hour: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
