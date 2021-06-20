const mongoose = require('mongoose');
const autoIncrementModelID = require('./counterModel');

const AppointmentSchema = new mongoose.Schema({
    appointment_id: {
        type: Number,
        unique: true,
        min: 1
    },
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
    },
    canceled: {
        type: Boolean,
        default: false
    }
});


AppointmentSchema.pre('save', function (next) {
    if (!this.isNew) {
        next();
        return;
    }

    autoIncrementModelID('Appointment', this, next);
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
