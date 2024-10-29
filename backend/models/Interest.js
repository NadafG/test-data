const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional: Change required based on your needs
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true }, // Required
    createdAt: { type: Date, default: Date.now } // Automatically set the date of inquiry
});

module.exports = mongoose.model('Interest', interestSchema);
