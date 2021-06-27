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
        }
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);
