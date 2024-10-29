const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,  // Mobile number field
    },
    address: {
        type: String,  // Address field
    },
    isVerified: {
        type: Boolean,  // Change this to Boolean
        default: false, // Default value should be false for new users
    },
    verificationToken: {
        type: String,    // A token used for email verification
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,  // Admin status field
        default: false, // Default value should be false for regular users
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userSchema);
