// models/Property.js
const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ensure this references the User model
        required: true
    },
    type: { type: String, required: true },
    propertyType: { type: String, required: true },
    listedBy: { type: String, required: true },
    projectName: { type: String, required: true },
    images: { type: [String], required: true },
    title: { type: String },
    description: { type: String, required: true },
    facing: { type: String, required: true },
    price: { type: String, required: true },
    location: { type: String, required: true },
    postedBy: { type: String, required: true },
    isApprove: {
        type: Boolean,  // Admin status field
        default: false, // Default value should be false for regular users
    },
    // Plot specific fields
    plotArea: {
        type: Number,
        required: function() { return this.propertyType === 'plot'; }
    },
    length: {
        type: Number,
        required: function() { return this.propertyType === 'plot'; }
    },
    breadth: {
        type: Number,
        required: function() { return this.propertyType === 'plot'; }
    },

    // Common fields for 'flat' and 'commercial'
    bedroom: {
        type: Number,
        required: function() { return this.propertyType === 'flat' }
    },
    bathroom: {
        type: Number,
        required: function() { return this.propertyType === 'flat' }
    },
    furnishing: {
        type: String,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    constructionStatus: {
        type: String,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    superBuiltupArea: {
        type: Number,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    carpetArea: {
        type: Number,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    maintenance: {
        type: Number,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    totalFloors: {
        type: Number,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    floorNo: {
        type: Number,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    },
    carParking: {
        type: String,
        required: function() { return this.propertyType === 'flat' || this.propertyType === 'commercial'; }
    }
}, { timestamps: true });

const Property = mongoose.model('Property', PropertySchema);

module.exports = Property;
