// controllers/propertyController.js
const Property = require('../models/Property');
const User = require('../models/User');

// Get all properties
// Get all properties
exports.getAllPropertyList = async (req, res) => {
    try {
        // Fetch properties from the database
        const properties = await Property.find().sort({ createdAt: -1 });

        if (!properties.length) {
            return res.status(404).json({ message: 'No properties found.' });
        }

        // Map over the properties and update the image paths
        const updatedProperties = properties.map(property => {
            return {
                ...property.toObject(), // Convert Mongoose document to plain object
                images: property.images.map(image => 
                    `${req.protocol}://${req.get('host')}/${image.replace(/\\/g, '/')}`
                )
            };
        });

        res.status(200).json(updatedProperties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ message: 'Server error while fetching properties.' });
    }
};
// Approve Property
exports.approveProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        property.isApprove = true;  // Assuming you have a status field in your schema
        await property.save();

        res.status(200).json({ message: 'Property approved successfully.' });
    } catch (error) {
        console.error('Error approving property:', error);
        res.status(500).json({ message: 'Server error while approving property.' });
    }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
    try {
        const propertyId = req.params.id;
        const property = await Property.findByIdAndDelete(propertyId);

        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }

        res.status(200).json({ message: 'Property deleted successfully.' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Server error while deleting property.' });
    }
};

// Get all users
exports.getAllUsersList = async (req, res) => {
    try {
        // Fetch users from the database
        const users = await User.find().sort({ createdAt: -1 });

        if (!users.length) {
            return res.status(404).json({ message: 'No users found.' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
};

// Approve users
exports.approveUser = async (req, res) => {
    try {
        const userId = req.params.id; // Corrected variable name
        const user = await User.findById(userId); // Corrected variable name

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.isVerified = true;  // Assuming you have a status field in your schema
        user.verificationToken = '';  // Assuming you have a status field in your schema
        await user.save();

        res.status(200).json({ message: 'User approved successfully.' });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: 'Server error while approving user.' });
    }
};

// Delete users
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id; // Corrected variable name
        const user = await User.findByIdAndDelete(userId); // Corrected variable name

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error while deleting user.' });
    }
};
