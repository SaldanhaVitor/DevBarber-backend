const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    data: {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        appointmens: {
            type: Number,
            default: 0
        },
        avaliacao: {
            type: Number,
            default: 0
        }
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
