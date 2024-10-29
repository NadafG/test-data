const Property = require('../models/Property');
const Interest = require('../models/Interest'); 
const mongoose = require('mongoose');

// Get properties associated with the authenticated user
exports.getMyPropertyList = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from the request
        console.log('Authenticated User ID:', userId);
        
        // Fetch properties related to the authenticated user
        const properties = await Property.find({ userId });

        // Debugging logs
        console.log('Querying properties for user ID:', userId);  
        console.log('Fetched Properties:', properties);
        
        // Check if properties exist
        if (!properties.length) {
            return res.status(404).json({ message: 'No properties found for this user.' });
        }

        // Send the fetched properties back to the client
        res.status(200).json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Server error while fetching properties.' });
    }
};

// Delete a property
exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params; // Get property ID from parameters
        const property = await Property.findByIdAndDelete(id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Server error while deleting property.' });
    }
};

// Update a property
exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params; // Get property ID from parameters
        const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validation
        });

        if (!updatedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Error updating property' });
    }
};

// Get user's interests list with associated properties
exports.myInterestsList = async (req, res) => {
    try {
        const interests = await Interest.find({ userId: req.user.id })
            .populate('propertyId', 'title propertyType location price images');

        if (!interests.length) {
            return res.status(404).json({ message: 'No interests found for this user' });
        }

        res.status(200).json(interests);
    } catch (error) {
        console.error('Error fetching interests:', error);
        res.status(500).json({ message: 'Server error while fetching interests' });
    }
};

// Remove a specific interest from user's interests list
exports.removeInterest = async (req, res) => {
    try {
        const interestId = req.params.id;
        const userId = req.user.id;

        const interest = await Interest.findOneAndDelete({ _id: interestId, userId });

        if (!interest) {
            return res.status(404).json({ message: 'Interest not found or does not belong to this user' });
        }

        res.status(200).json({ message: 'Interest removed successfully' });
    } catch (error) {
        console.error('Error while removing interest:', error);
        res.status(500).json({ message: 'Server error while removing interest' });
    }
};
